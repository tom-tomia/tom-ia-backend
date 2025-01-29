import type { Schema, Struct } from '@strapi/strapi';

export interface SchoolSchool extends Struct.ComponentSchema {
  collectionName: 'components_school_schools';
  info: {
    displayName: 'School';
    icon: 'calendar';
  };
  attributes: {
    school_location: Schema.Attribute.String;
    school_name: Schema.Attribute.String;
    subjects: Schema.Attribute.String;
    year_groups: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'school.school': SchoolSchool;
    }
  }
}
