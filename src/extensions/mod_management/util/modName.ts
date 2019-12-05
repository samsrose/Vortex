import {getSafe} from '../../../util/storeHelper';

import {IMod, IModReference} from '../types/IMod';

export interface INameOptions {
  version: boolean;
}

export function modNameFromAttributes(mod: { [key: string]: any }, options?: INameOptions): string {
  const fields = [];
  fields.push(
    getSafe(mod, ['customFileName'], '')
    || getSafe(mod, ['logicalFileName'], '')
    || getSafe(mod, ['fileName'], '')
    || getSafe(mod, ['name'], ''));

  if (options !== undefined && options.version) {
    fields.push(`(v${getSafe(mod, ['version'], '?')})`);
  }

  return fields.join(' ');
}

/**
 * determins the mod name to show to the user based on the mod attributes.
 * absolutely never use this function for anything other than showing the output
 * to the user, the output must not be stored or used as an identifier for the mod,
 * I reserve the right to change the algorithm at any time.
 * @param {IMod} mod
 * @param {INameOptions} [options]
 * @returns {string}
 */
function modName(mod: IMod, options?: INameOptions): string {
  if ((mod === undefined) || (mod.attributes === undefined)) {
    return undefined;
  }
  return modNameFromAttributes(mod.attributes, options) || mod.installationPath;
}

export interface IRenderOptions {
  version?: boolean;
}

export function renderModReference(ref: IModReference, mod: IMod, options?: IRenderOptions) {
  const version = (options === undefined) || options.version !== false;

  if ((ref.id !== undefined) && (mod !== undefined)) {
    return modName(mod, { version });
  }

  if (ref.description !== undefined) {
    return ref.description;
  }

  if ((ref.logicalFileName === undefined) && (ref.fileExpression === undefined)) {
    return ref.fileMD5 || ref.id;
  }

  let name = ref.logicalFileName || ref.fileExpression;
  if ((ref.versionMatch !== undefined) && version) {
    name += ' v' + ref.versionMatch;
  }
  return name;
}

export default modName;