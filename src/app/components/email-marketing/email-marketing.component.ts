import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EmailService } from "src/app/services/email-marketing.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: 'email-marketing',
    templateUrl: './email-marketing.component.html',
    styleUrls: ['./email-marketing.component.scss'],
})

export class EmailMarketingComponent implements OnInit {
    campaignList: any = [];
    page: number = 1;
    showLoader: boolean = false;
    constructor(
        private emailService: EmailService,
        private fb: FormBuilder,
        private router: Router,
        private aroute: ActivatedRoute,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.getCampaigns();
    }

    getCampaigns() {
        this.showLoader = true;
        this.emailService.getCampaigns().subscribe((res: any) => {
            this.campaignList = res.statistics;
            this.showLoader = false;
        }, (err: any) => {
            this.showLoader = false;
            this.notificationService.success(err.error.message);
        });
    }

    navigateToEmailRecipient() {
        this.router.navigate(['recipient'], { relativeTo: this.aroute });
    }

    navigateToCreateCampaign() {
        this.router.navigate(['create-campaign'], { relativeTo: this.aroute });
    }
    
    editCampaign(campaign: any) {
        this.router.navigate(['create-campaign', campaign.id], { relativeTo: this.aroute });
    }

    viewCampaign(campaign: any) {
        this.router.navigate(['view-campaign', campaign.id], { relativeTo: this.aroute });
    }
}