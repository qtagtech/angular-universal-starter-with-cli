/**
 * This file and `main.node.ts` are identical, at the moment(!)
 * By splitting these, you're able to create logic, imports, etc that are "Platform" specific.
 * If you want your code to be completely Universal and don't need that
 * You can also just have 1 file, that is imported into both
 * client.ts and server.ts
 */

import { NgModule } from '@angular/core';
import { UniversalModule, isBrowser, isNode, AUTO_PREBOOT } from 'angular2-universal/browser';
import { FormsModule } from '@angular/forms';
import { HomeModule } from './home/home.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './index';

/**
 * Top-level NgModule "container"
 */
@NgModule({
  /** Root App Component */
  bootstrap: [ AppComponent ],
  /** Our Components */
  imports: [
    /**
     * NOTE: Needs to be your first import (!)
     * BrowserModule, HttpModule, and JsonpModule are included
     */
    FormsModule,
    RouterModule.forRoot([], { useHash: false }),
    AppRoutingModule,
    HomeModule,
    UniversalModule, // always at the end to override http
    /**
     * using routes
     */
    // RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },
    // { provide: AUTO_PREBOOT, useValue: false } // turn off auto preboot complete
  ]
})
export class AppModule {

}

export { AppComponent } from './app.component'
