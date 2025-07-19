import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StompService } from 'src/app/services/stomp.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  username : any;
  matches : any;
  section : any;
  empty : any;

  constructor(private route : ActivatedRoute, private http : HttpClient, private router : Router, private stomp : StompService) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.section = document.getElementById("section");
    this.empty = document.getElementById("empty");

    this.stomp.subscribe("/" + this.username, (frame : any) : void => {
      let body = JSON.parse(frame.body);
      let choice = body.choice;

      if (choice === "Matched") {
        this.matches++;
        this.empty.className = "empty-off";

        let div = document.createElement("div");
        div.id = body.match.username;
        let match = document.createElement("div");
        let img = document.createElement("img");
        let p = document.createElement("p");

        this.section.appendChild(div);
        div.appendChild(match);
        match.appendChild(img);
        div.appendChild(p);

        img.src = body.match.picture;
        img.style.width = "200px";
        img.style.height = "200px";
        img.style.borderRadius = "50%";
        img.style.margin = "10px";
        img.style.boxShadow = "-1px 0 10px black";
        img.style.border = "1px solid black";
        img.style.cursor = "pointer";

        p.innerHTML = body.match.username;
        p.style.textAlign = "center";
        p.style.cursor = "default";
        p.style.margin = "15px";
        p.style.color = "white";
        
        img.addEventListener("click", () : void => {
          this.stomp.unsubscribe("/" + this.username);
          this.router.navigate(["/match-profile", this.username, body.match.username]);
        });
        
      } else if (choice === "Unmatch") {
        let div = document.getElementById(body.relationship.user.username);
        div?.remove();
        this.matches--;

        if (this.matches === 0) {
          this.empty.className = "empty-on";
          this.empty.innerHTML = "You have no matches"
        }

      } else if (choice === "Delete") {
        let div = document.getElementById(body.matchname);
        div?.remove();
        this.matches--;

        if (this.matches === 0) {
          this.empty.className = "empty-on";
          this.empty.innerHTML = "You have no matches"
        }
      }
    }, {id: "/" + this.username});

    this.loadCandidates();
  }

  loadCandidates() : void {
    this.section.innerHTML = "";

    this.http.get("https://catphish-back-end.azurewebsites.net/matches/" + this.username).subscribe((response : any) : void => {
      this.matches = response.length;

      if (response.length === 0) {
        this.empty.className = "empty-on";
        this.empty.innerHTML = "You have no matches"
        
      } else {
        for (let i = 0; i < response.length; i++) {
          let div = document.createElement("div");
          div.id = response[i].username;
          let match = document.createElement("div");
          let img = document.createElement("img");
          let p = document.createElement("p");

          this.section.appendChild(div);
          div.appendChild(match);
          match.appendChild(img);
          div.appendChild(p);

          img.src = "data:image/jpeg;base64," + response[i].pictureBlob;
          img.style.width = "200px";
          img.style.height = "200px";
          img.style.borderRadius = "50%";
          img.style.margin = "10px";
          img.style.boxShadow = "-1px 0 10px black";
          img.style.border = "1px solid black";
          img.style.cursor = "pointer";

          p.innerHTML = response[i].username;
          p.style.textAlign = "center";
          p.style.cursor = "default";
          p.style.margin = "15px";
          p.style.color = "white";
          
          img.addEventListener("click", () : void => {
            this.stomp.unsubscribe("/" + this.username);
            this.router.navigate(["/match-profile", this.username, response[i].username]);
          });
        }
      }
    });
  }

  enterProfile() : void {
    this.stomp.unsubscribe("/" + this.username);
    this.router.navigate(["/profile", this.username]);
  }

  enterMatch() : void {
    this.stomp.unsubscribe("/" + this.username);
    this.router.navigate(["/match", this.username]);
  }

  reload() : void {
    window.location.reload();
  }

  enterMain() : void {
    this.stomp.unsubscribe("/" + this.username);
    this.router.navigate(["/"]);
  }

  enterDelete() : void {
    this.stomp.unsubscribe("/" + this.username);
    this.router.navigate(["/delete", this.username]);
  }
}