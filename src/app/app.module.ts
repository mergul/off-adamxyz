import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/token.interceptor';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth.service';
import { UserService } from './core/user.service';
import { NewsService } from './core/news.service';
import { WindowRef } from './core/window.service';
import { ReactiveStreamsService } from './core/reactive-streams.service';
import { ScriptLoaderService } from './core/script-loader.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoLoggedNavModule } from './no-logged-nav/no-logged-nav.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NoLoggedNavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [
    ReactiveStreamsService,
    AuthService,
    UserService,
    NewsService,
    WindowRef,
    ScriptLoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [BrowserAnimationsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
