import { Component } from "@angular/core";
import { UtilsService } from "../../services/utils.service";

@Component({
    selector: 'my-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    standalone: false
})
export class ImageViewerComponent {

    constructor(private _utilsService: UtilsService) {}

    getImgUrl() {
        return this._utilsService.shownImageUrl;
    }

    close() {
        this._utilsService.shownImageUrl = undefined;
    }

}