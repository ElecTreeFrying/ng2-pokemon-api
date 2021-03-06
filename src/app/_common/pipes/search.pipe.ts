import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from 'lodash';

import { type } from '../services/shared.service';


@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, option: string, object?: any, data?: any): any {

    if (option === 'selection-display') {
      const views = [ 'pokémon', 'moves', 'items', 'berries' ];

      if (!value && value !== 0) return '';

      return `Select an option to display ${views[+value]}.`;
    }

    if (!value) return;

    if (option === 'type-color') {
      return type.find(e => e.name.toLowerCase() === value).color.dark;
    }

    if (option === 'spn-placeholder') {

      if (object === 'pokemonNo') {
        return `(${value.meta.min} to ${807}) and (${10001} to *${value.meta.max})`;
      }

      if (object === 'moveNo') {
        return `(${value.meta.min} to ${728}) and (${10001} to *${value.meta.max})`;
      }

      return `(${value.meta.min} to *${value.meta.max})`;
    }

    if (option === 'spn-mm-to-string') {
      return `${value}`;
    }

    if (option === 'spn-input-display') {
      if (object) return 'Invalid data.';
      if (value === '') return '';
      if (data === 'baseExperience') {
        return `${+value} pts.`;
      }
      if (data === 'baseHappiness' || data === 'captureRate') {
        const fixed = (+value / 255).toFixed(2);
        return `${ fixed.includes('.00') ? `${fixed.replace('.00', '')}` : fixed }%`;
      }
      if (data === 'hatchCounter') {
        return `${255 * (+value + 1)} steps`;
      }
      if (data === 'height') {
        return (+value / 3.048).toFixed(2).toString() + ' ft';
      }
      if (data === 'pokemonNo') {
        return `#${value}`;
      }
      if (data === 'weight') {
        return (+value / 4.536).toFixed(1).toString() + ' lbs';
      }
      if (data === 'accuracy' || data === 'effectChance' || data === 'ailmentChance' || data === 'flinchChance' || data === 'statChance' || data === 'critRate') {
        return `${value}%`;
      }
      if (data === 'moveNo') {
        return `#${value}`;
      }
      if (data === 'drain' || data === 'healing') {
        return +value < 0 ? `${value}% HP` : `+${value}% HP`;
      }
      if (data === 'maxHits' || data === 'maxTurns' || data === 'minHits' || data === 'minTurns') {
        return `${value}`;
      }
      if (data === 'power') {
        return `${value} Atk.`;
      }
      if (data === 'pp') {
        return `${value} pp`;
      }
      if (data === 'priority') {
        return `${value}`;
      }
    }

    if (option === 'spn-move-name') {
      return value.name.split('-').join(' ');
    }

    if (option === 'spn-selectionList_6') {
      return value.split(' ').join('-');
    }

    if (option === 'sm-list1-name') {

      if (value.includes('generation')) {

        value = value.split(' ');

        return `${capitalize(value[0])} ${value[1].toUpperCase()}`;
      }

      return value.replace('pokemon', 'pokémon').replace('+', ' + ');
    }

    if (option === 'sm-name') {
      return value.names.find(e => e.language.name === 'en').name;
    }

    if (option === 'sm-type') {
      return type.find(e => e.name.toLowerCase() === value.type.name).color.default;
    }

  }

}
