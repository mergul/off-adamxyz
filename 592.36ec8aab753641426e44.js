(self.webpackChunkadamxyz=self.webpackChunkadamxyz||[]).push([[592],{6297:(e,r,s)=>{"use strict";s.d(r,{o:()=>S});var i=s(3148),t=s(878),u=s(3530),c=s(4689),h=s(3982),a=s(5366),o=s(7905),n=s(3464),v=s(8876);let S=(()=>{class e{constructor(e,r,s){this.userService=e,this.router=r,this.authService=s}canActivate(e,r){return this.userService.dbUser?(0,t.of)(!0):this.authService.isLoggedIn().pipe((0,u.P)(),(0,c.w)(e=>e?"/login"===r.url||"/register"===r.url||"/loginin"===r.url?this.router.navigate(["/user"]):this.authService.getUser().pipe((0,h.zg)(e=>e&&this.userService.user?(this.userService._loggedUser=this.userService.user,this.userService._loggedUser.id=this.userService.user.id=this.userService.createId(e.uid),this.userService.setReactiveListeners(),this.userService._me=this.userService.getDbUser("/api/rest/start/user/"+this.userService.user.id+"/"+this.userService.getRandom()),(0,i.D)([this.userService._me,this.authService.token])):(0,i.D)([(0,t.of)(this.userService.dbUser),(0,t.of)("")])),(0,c.w)(e=>e[0]?(this.userService.setDbUser(e[0]),this.userService.user&&(this.userService.user.token=e[1]),this.authService.changeEmitter.next((0,t.of)(!0)),this.router.navigate(["/upload"])):this.router.navigate(["/home"]))):"/upload"===r.url?(this.userService.redirectUrl="/upload",this.router.navigate(["/loginin"])):(0,t.of)(!0)))}}return e.\u0275fac=function(r){return new(r||e)(a.LFG(o.K),a.LFG(n.F0),a.LFG(v.e))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()},8724:(e,r,s)=>{"use strict";s.d(r,{K:()=>c});var i=s(1116),t=s(2935),u=s(5366);let c=(()=>{class e{}return e.\u0275fac=function(r){return new(r||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({imports:[[i.ez,t.Is]]}),e})()}}]);