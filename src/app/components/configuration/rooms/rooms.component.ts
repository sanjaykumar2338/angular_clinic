import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: "rooms",
    templateUrl: "./rooms.component.html",
    styleUrls: ["./rooms.component.scss"],
})

export class RoomsComponent implements OnInit{
    public roomName: string = "";
    public rooms: any[] = [];
    constructor(private configurationSvc: ConfigurationService,
        private notifySvc: NotificationService) {}

    ngOnInit(): void {
        this.getRooms();
    }

    addRoom() {
        this.configurationSvc.addRoom(this.roomName).subscribe((res) => {
            this.notifySvc.success("Sala creada con éxito");
            this.rooms.unshift(res.data);
            this.roomName = "";
        }, (err) => {
            this.notifySvc.error(err.error.message);
        }
        );
    }

    getRooms() {
        this.configurationSvc.getRooms().subscribe((res) => {
            this.rooms = res.data;
        }, 
        (err) => {
            this.notifySvc.error("Algo salió mal");
        });
    }

    deleteRoom(id: string) {
        this.notifySvc.confirmDialog().then((result) => {
            if (result.isConfirmed) {
                this.configurationSvc.deleteRoom(id).subscribe((res) => {
                    this.rooms.splice(this.rooms.findIndex((room) => room.id === id), 1);
                    this.notifySvc.success("Sala eliminada con éxito");
                });            }
        });

    }
    
}