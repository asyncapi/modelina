import { JavaScriptGenerator } from '../../../src/generators'; 

describe('JavaScriptGenerator', function() {
  let generator: JavaScriptGenerator;
  beforeEach(() => {
    generator = new JavaScriptGenerator();
  });

  test('should render `class` type', async function() {});

//   test('should render `class` type', async function() {
//     const doc = {
//       $id: "Address",
//       type: "object",
//       properties: {
//         street_name:    { type: "string" },
//         city:           { type: "string", description: "City description" },
//         state:          { type: "string" },
//         house_number:   { type: "number" },
//         marriage:       { type: "boolean", description: "Status if marriage live in given house" },
//         members:        { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }], },
//       },
//       required: ["street_name", "city", "state", "house_number"],
//     };
//     const expected = `class Address {
//   street_name;
//   city;
//   state;
//   house_number;
//   marriage;
//   members;
      
//   constructor(input) {
//     this.street_name = input.street_name;
//     this.city = input.city;
//     this.state = input.state;
//     this.house_number = input.house_number;
//     this.marriage = input.marriage;
//     this.members = input.members;
//   }
      
//   get street_name() { return this.street_name; }
//   set street_name(street_name) { this.street_name = street_name; }

//   get city() { return this.city; }
//   set city(city) { this.city = city; }

//   get state() { return this.state; }
//   set state(state) { this.state = state; }

//   get house_number() { return this.house_number; }
//   set house_number(house_number) { this.house_number = house_number; }

//   get marriage() { return this.marriage; }
//   set marriage(marriage) { this.marriage = marriage; }

//   get members() { return this.members; }
//   set members(members) { this.members = members; }
// }`;

//     const inputModel = await generator.process(doc);
//     const model = inputModel.models["Address"];

//     let classModel = await generator.renderClass(model, inputModel);
//     expect(classModel).toEqual(expected);

//     classModel = await generator.render(model, inputModel);
//     expect(classModel).toEqual(expected);
//   });
});
