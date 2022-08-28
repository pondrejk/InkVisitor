import { EntityEnums, RelationEnums } from ".";

export namespace EnumValidators {
  /**
   * Validates RelationEnums.Type value
   * @param input 
   * @returns 
   */
  export function IsValidRelationType(input: RelationEnums.Type): boolean {
    return (
      [
        RelationEnums.Type.Superclass,
        RelationEnums.Type.SuperordinateLocation,
        RelationEnums.Type.Synonym,
        RelationEnums.Type.Antonym,
        RelationEnums.Type.Troponym,
        RelationEnums.Type.PropertyReciprocal,
        RelationEnums.Type.SubjectActantReciprocal,
        RelationEnums.Type.ActionEventEquivalent,
        RelationEnums.Type.Related,
        RelationEnums.Type.Classification,
        RelationEnums.Type.Identification,
      ].indexOf(input) !== -1
    );
  }

  /**
   * Validates EntityEnums.Class value
   * @param input 
   * @returns 
   */
  export function IsValidEntityClass(input: EntityEnums.Class): boolean {
    return (
      [
        EntityEnums.Class.Action,
        EntityEnums.Class.Territory,
        EntityEnums.Class.Statement,
        EntityEnums.Class.Resource,
        EntityEnums.Class.Person,
        EntityEnums.Class.Group,
        EntityEnums.Class.Object,
        EntityEnums.Class.Concept,
        EntityEnums.Class.Location,
        EntityEnums.Class.Value,
        EntityEnums.Class.Event,
      ].indexOf(input) !== -1
    );
  }
}