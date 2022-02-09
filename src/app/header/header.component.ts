import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;

    private userSub: Subscription;

    collapsed = true;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>) { }

        ngOnInit(): void {
           this.userSub = this.store
           .select('auth')
           .pipe(map(authState => authState.user))
           .subscribe(user => {
            this.isAuthenticated = !!user;
           });
        }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchingData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

}