import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil } from 'rxjs/operators'

import { HttpService } from '../common/core/service/http.service';
import { SharedService } from '../common/core/service/shared.service';

import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';

import { PokeCard } from '../common/shared/interface/shared';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
  host: {
    '(document:keydown)': 'onEsc($event)'
  }
})
export class PokemonComponent implements OnInit {

  _pokemon: PokeCard[] = [];
  cherry: string = 'https://cdn130.picsart.com/257281221032212.png?r1024x1024';
  region: string = 'Kanto Region';
  currentGen: number = 0;
  pokemonOther: boolean = true;
  sheet: { isOpen: boolean, object?: MatBottomSheetRef<any> } = { isOpen: false };

  private destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private bottomsheet: MatBottomSheet,
    private service: HttpService,
    private shared: SharedService
  ) {
    this.shared.pokemonChange.pipe( takeUntil(this.destroyed) ).subscribe((pokemon: any) => {

      this.keyDownEsc();

      if (this.region === pokemon.region) return;
      this.region = pokemon.region;
      this.currentGen = pokemon.gen;
      this.pokemonOther = pokemon.other
      this._pokemon = this.pokemonOther
        ? this.service.getPokedexByGeneration(this.currentGen)
        : this.service.getPokedex(this.currentGen)

    });

    this.shared.bottomsheetChange.pipe( takeUntil(this.destroyed) ).subscribe((res: PokeCard[] | number) => {

      res === 0 && this.sheet.isOpen
        ? this.sheet.object.dismiss()
        : res === 0 && !this.sheet.isOpen
          ? (() => {
              this.sheet.object = this.bottomsheet.open(BottomSheetComponent, {
                hasBackdrop: false,
                data: { region: this.region, pokemon: this._pokemon }
              })

              this.sheet.object.instance.filterObservable.subscribe((res: PokeCard[]) => {
                this.keyDown();
                this._pokemon = res;
              });

              this.sheet.object.afterOpened().subscribe(() => { this.sheet.isOpen = true; });
              this.sheet.object.afterDismissed().subscribe(() => { this.closeSheet(); })

            })() : 0;

    });
  }

  ngOnInit() {
    this.sheet.isOpen = false;
    localStorage.region = 'Kanto Region';
    this.shared.sharedChange.subscribe((res: PokeCard[]) => {
      this._pokemon = res;
    });
  }
  
  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  trackByFn(index) {
    return index;
  }

  selectPokemon(poke: PokeCard) {
    const url = `assets/api/v2/pokemon/${poke.id}/index.json`;
    this.service.getPokemon({ url_pokemon: url, url_species: poke.url, version: poke.version, name: poke.name, isEsc: false });
    
  }

  onEsc(event?: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.service.getPokemon({ url_pokemon: '', url_species: '', version: '', name: 'Loading...', isEsc: true });
      this.sheet.isOpen ? this.closeSheet() : 0;
    }
  }

  private keyDownEsc() {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
  }

  private keyDown() {
    const event = new KeyboardEvent('keydown', { key: 'Alt' });
    document.dispatchEvent(event);
  }

  private closeSheet() {
    this.sheet.isOpen = false;
    this.sheet.object.dismiss();
    const pokemon = this.pokemonOther
      ? this.service.getPokedexByGeneration(this.currentGen)
      : this.service.getPokedex(this.currentGen)
    this.keyDown();
    this._pokemon = pokemon;
  }

}
