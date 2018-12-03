import Axios from 'axios';

export default class Patch {

  private cdragonPatches: string[];
  private value: string;
  private type: string;

  /**
   * constructs an instance of the Patch class which manages
   * patches in both DDragon and CDragon format.
   *
   * @param patch requires a type and value to be inserted.
   * - type: should be either 'ddragon' or 'cdragon'
   * - value: the patch value in either DDragon or CDragon format
   */
  constructor(patch = { type: 'ddragon', value: null }) {
    validatePatch(patch);
    this.value = patch.value;
    this.type = patch.type;
  }

  public async load() {
    const patches = (await Axios.get('https://raw.communitydragon.org/json/')).data
    .filter(entry => entry.type === 'directory' && !isNaN(entry.name[0]))
      .map(entry => entry.name)
      .sort((a, b) => versionCompare(a, b, null))
      .reverse();

    this.cdragonPatches = patches;
  }

  /**
   * returns the patch in CDragon format
   *
   * @returns {string}  the patch in CDragon format
   */
  public getCDragonPatch(): string {
    if (this.type === PatchType.CDRAGON) {
      return this.value;
    } else {
      const cdragonValue = (this.value.split('.', 2)).join('.');
      if (this.cdragonPatches.indexOf(cdragonValue) ! < 0) {
        return cdragonValue;
      } else return this.cdragonPatches[0];
    }
  }

  /**
   * returns the patch in DDragon format
   *
   * @returns {string}  the patch in DDragon format
   */
  public getDDragonPatch(): string {
    if (this.type === PatchType.DDRAGON) {
      return this.value;
    } else {
      return (this.value + '.1');
    }
  }
}

/**
 * makes sure the patch is valid
 *
 * @param {{}} patch the patch object parsed into the Patch Constructor
 */
function validatePatch(patch) {
  /** check if patch value is given */
  if (!patch.value) {
    throw new Error(
      'missing patch value, cannot construct Patch entity',
    );
  }

  /** check if patch type is valid */
  if (patch.type !== PatchType.DDRAGON && patch.type !== PatchType.CDRAGON) {
    throw new Error(
      `invalid patch type given, value '${patch.type}' ` +
      `doesn't match '${PatchType.DDRAGON}' nor '${PatchType.CDRAGON}'`,
    );
  }
}

enum PatchType {
  CDRAGON = 'cdragon',
  DDRAGON = 'ddragon',
}

function versionCompare(v1, v2, options) {
  const lexicographical = options && options.lexicographical;
  const zeroExtend = options && options.zeroExtend;
  let v1parts = v1.split('.');
  let v2parts = v2.split('.');

  function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
  }

  if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push('0');
      while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
          return 1;
      }

      if (v1parts[i] === v2parts[i]) {
          continue;
      }
      else if (v1parts[i] > v2parts[i]) {
          return 1;
      }
      else {
          return -1;
      }
  }

  if (v1parts.length !== v2parts.length) {
      return -1;
  }

  return 0;
}