import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { Mushroom } from "../../models/mushroom.model";
import { MushroomsService } from "../../services/mushrooms.service";
import { LoaderService } from "../../services/loader.service";
import { TitleCasePipe } from "@angular/common";
import { UtilsService } from "../../services/utils.service";
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
    selector: 'my-shroomdle',
    templateUrl: './shroomdle.component.html',
    styleUrls: ['./shroomdle.component.scss'],
    standalone: true,
    imports: [
        TitleCasePipe,
        TranslatePipe
    ]
})
export class ShroomdleComponent implements OnInit, AfterViewInit {

    @ViewChild('mushroomSearch') mushroomSearch?: ElementRef<HTMLInputElement>;

    mushrooms: Mushroom[] = [];

    showList = false;
    error = false;

    lost = false;
    won = false;

    private _currentBox = 0;
    private _currentIndex = 0;

    private _overrideLetter = false;

    constructor(
        private _mushroomService: MushroomsService,
        private _loaderService: LoaderService,
        private _utilsService: UtilsService
    ) {}

    ngOnInit(): void {
        this._loaderService.show();

        this._mushroomService.getMushrooms().subscribe({
            next: (res) => {
                this._loaderService.hide();
                this.mushrooms = res;
            },
            error: () => {
                this._loaderService.hide();
            }
        });
    }

    ngAfterViewInit(): void {
        this.mushroomSearch?.nativeElement.addEventListener('input', (ev) => {
            this.showList = !!this._getInputValue();
        });

        this._loaderService.show();

        setTimeout(() => {
            const attemptedWords = this._mushroomService.shroomdle.words.sort((a, b) => a.index - b.index);

            for (const word of attemptedWords) {
                for (let i = 0; i < word.attempt.length; i++) {
                    this._getHiddenInput(this._currentBox, i).value = word.attempt[i].toUpperCase();
                }

                this.makeWordAttempt(false);
            }

            this._loaderService.hide();
        }, 100);
    }

    @HostListener('window:keydown', ['$event'])
    onInput(ev: KeyboardEvent | null) {
        if (!this.hasGuessedDetails() || this.lost || this.won) {
            return;
        }

        switch(ev?.key) {
            case 'Backspace':
                if (this._getCurrentInput().value || this._overrideLetter) {
                    this._getCurrentInput().value = '';
                    this._overrideLetter = false;
                } else {
                    if (this._currentIndex > 0) {
                        const prevInput = this._getHiddenInput(this._currentBox, this._currentIndex - 1);
                        prevInput.value = '';

                        this._currentIndex -= 1;
                    }
                }

                break;
            case 'Enter':
                this.makeWordAttempt();
                break;
            default:
                if (!this.checkInput(ev?.key || '')) {
                    return;
                }

                const value = (ev?.key || '').toUpperCase()

                if (!this._getCurrentInput().value || this._overrideLetter) {
                    this._getCurrentInput().value = value;
                    this._overrideLetter = false;
                } else {
                    if (this._currentIndex < this.getSpecies().length - 1) {
                        const nextInput = this._getHiddenInput(this._currentBox, this._currentIndex + 1);
                        nextInput.value = value;

                        this._currentIndex += 1;
                    }
                }
        }
    }

    private _getCurrentInput() {
        return this._getHiddenInput(this._currentBox, this._currentIndex);
    }

    hasGuessedDetails() {
        if (this._mushroomService.shroomdle.wonWithList) {
            this.won = true;
            return false;
        }

        for (const attempt of this.getAttempts()) {
            if (
                this.isDetailCorrect(attempt.mushroom, 'class') &&
                this.isDetailCorrect(attempt.mushroom, 'order') &&
                this.isDetailCorrect(attempt.mushroom, 'family') &&
                this.isDetailCorrect(attempt.mushroom, 'genus')
            ) {
                return true;
            }
        }

        return false;
    }

    getMushrooms() {
        if (!this._getInputValue()) {
            return [];
        }

        return this.mushrooms
            .filter(m => !this._mushroomService.shroomdle.attempts.map(a => a.mushroom.name).includes(m.name))
            .filter(m => {
                return (
                    this._sanify(m.name).includes(this._sanify(this._getInputValue()!)) ||
                    this._sanify(this._getInputValue()!).includes(this._sanify(m.name))
                );
            });
    }

    getAttemptsLeft() {
        return 10 - this.getAttempts().length;
    }

    makeAttempt(mushroom: Mushroom) {
        if (this._getInput()) {
            this._getInput()!.value = '';
            this.showList = false;
        }

        this._mushroomService.makeAttempt(mushroom);

        if (mushroom.name === this.getRandomMushroom()?.name) {
            this._mushroomService.shroomdle.wonWithList = true;
            this._mushroomService.saveShroomdle();

            this.won = true;

            return;
        }

        if (!this.getAttemptsLeft()) {
            this.lost = true;
        }
    }

    makeWordAttempt(saveAttempt = true) {
        const letters = [];

        for (let i = 0; i < this.getSpecies().length; i++) {
            letters.push(this._getHiddenInput(this._currentBox, i).value || ' ');
        }

        const word = letters.join('').toLowerCase();
        const species = this.mushrooms.map(m => m.species);

        this.error = false;

        if (!species.includes(word) || word.includes(' ')) {
            this.error = true;
            return;
        }

        const correctSpecies = this.getSpecies().join('');

        for (let i = 0; i < this.getSpecies().length; i++) {
            const correctLetter = this.getSpecies()[i];

            if (correctSpecies.includes(word[i])) {
                this._getLetterBox(i).classList.add('present');
            } else {
                this._getLetterBox(i).classList.add('not-present');
            }

            if (word[i] === correctLetter) {
                this._getLetterBox(i).classList.add('correct');
            }
        }

        if (saveAttempt) {
            this._mushroomService.makeWordAttempt(word);
        }

        if (word === correctSpecies) {
            this.won = true;
            return;
        }

        if (this._currentBox === this.getSpecies().length - 1) {
            this.lost = true;
            return;
        }

        this._currentBox += 1;
        this._currentIndex = 0;
    }

    getAttempts() {
        return this._mushroomService.shroomdle.attempts.sort((a, b) => a.index - b.index).reverse();
    }

    isDetailCorrect(mushroom: Mushroom, detail: keyof Mushroom) {
        if (!this.getRandomMushroom()) {
            return false;
        }

        return mushroom[detail] === this.getRandomMushroom()![detail];
    }

    private _getInput() {
        return this.mushroomSearch?.nativeElement;
    }

    private _getInputValue() {
        return this.mushroomSearch?.nativeElement.value;
    }

    private _getHiddenInput(box: number, index: number) {
        return document.querySelector(`#hidden-input-${box}-${index}`) as HTMLInputElement;
    }

    private _getLetterBox(index: number) {
        const box = document.querySelectorAll('.box')[this._currentBox]
        const letter = box.querySelectorAll('.letter')[index];

        return letter;
    }

    private _sanify(text: string) {
        return text.toLowerCase().replaceAll(' ', '');
    }

    getRandomMushroom(): Mushroom | undefined {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const seed = today.getTime();
        const randomIndex = this._utilsService.seededRandom(seed, 0, this.mushrooms.length - 1, true);
        const randomMushroom = this.mushrooms[randomIndex];
        return randomMushroom;
    }

    getSpecies() {
        return this.getRandomMushroom()?.species?.split('') || [];
    }

    checkInput(input: string) {
        const regex = new RegExp('^[a-zA-Z]$');
        return regex.test(input);
    }

    focusInput(input: HTMLInputElement) {
        const index = +input.id.split('-')[3];
        this._currentIndex = index;
        this._overrideLetter = true;
    }

    getImgName(name?: string) {
        const mushroomName = (name || '').replaceAll(' ', '');
        const folderName = (name || '').split(' ')[0];

        return `${folderName}/${mushroomName}/${mushroomName}`;
    }

}