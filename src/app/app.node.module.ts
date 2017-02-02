/**
 * This file and `main.browser.ts` are identical, at the moment(!)
 * By splitting these, you're able to create logic, imports, etc that are "Platform" specific.
 * If you want your code to be completely Universal and don't need that
 * You can also just have 1 file, that is imported into both
 * client.ts and server.ts
 */

import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './index';
import { HomeModule } from './home/home.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

/**
 * Top-level NgModule "container"
 */
@NgModule({
  /** Root App Component */
  bootstrap: [ AppComponent ],
  /** Our Components */
  declarations: [ AppComponent ],
  imports: [
    /**
     * NOTE: Needs to be your first import (!)
     * NodeModule, NodeHttpModule, NodeJsonpModule are included
     */
    FormsModule,
    RouterModule.forRoot([], { useHash: false }),

    HomeModule,

    UniversalModule,
    /**
     * using routes
     */
    // RouterModule.forRoot(appRoutes)
  ]
})
export class AppModule {

}
