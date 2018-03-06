import CDragon from "./cdragon";

export default class Patch {
  
  private value: string;
  private type: string;
  
  /**
  * constucts an instance of the Patch class which manages
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
  
  /** 
  * returns the patch in CDragon format
  * 
  * @returns {string}  the patch in CDragon format
  */
  public getCDragonPatch(): string {
    if (this.type == PatchType.CDRAGON) {
      return this.value;
    } else {
      return (this.value.split('.', 2)).join('.');
    }
  }
  
  /** 
  * returns the patch in DDragon format
  * 
  * @returns {string}  the patch in DDragon format
  */
  public getDDragonPatch(): string {
    if (this.type == PatchType.DDRAGON) {
      return this.value;
    } else {
      return (this.value + '.1')
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
      'missing patch value, cannot construct Patch entity'
    );
  }
  
  /** check if patch type is valid */
  if (patch.type != PatchType.DDRAGON && patch.type != PatchType.CDRAGON) {
    throw new Error(
      `invalid patch type given, value '${patch.type}' ` + 
      `doesn't match '${PatchType.DDRAGON}' nor '${PatchType.CDRAGON}'`
    )
  }
}

enum PatchType {
  CDRAGON = 'cdragon',
  DDRAGON = 'ddragon',
}