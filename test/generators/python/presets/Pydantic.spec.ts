import {
  PythonGenerator,
  PYTHON_PYDANTIC_PRESET
} from '../../../../src/generators/python';

describe('PYTHON_PYDANTIC_PRESET', () => {
  let generator: PythonGenerator;

  beforeEach(() => {
    generator = new PythonGenerator({
      presets: [PYTHON_PYDANTIC_PRESET]
    });
  });

  test('should render pydantic for class', async () => {
    const doc = {
      title: 'Test',
      type: 'object',
      properties: {
        prop: {
          description: `test
  multi
  line
  description`,
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render union to support Python < 3.10', async () => {
    const doc = {
      title: 'UnionTest',
      type: 'object',
      properties: {
        unionTest: {
          oneOf: [
            {
              title: 'Union1',
              type: 'object',
              properties: {
                testProp1: {
                  type: 'string'
                }
              }
            },
            {
              title: 'Union2',
              type: 'object',
              properties: {
                testProp2: {
                  type: 'string'
                }
              }
            }
          ]
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should render nullable union', async () => {
    const doc = {
      title: 'NullableUnionTest',
      type: 'object',
      required: ['nullableUnionTest'],
      properties: {
        nullableUnionTest: {
          anyOf: [
            {
              title: 'Union1',
              type: 'object',
              properties: {
                testProp1: {
                  type: 'string'
                }
              }
            },
            {
              type: 'null'
            }
          ]
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should render default value for discriminator when using polymorphism', async () => {
    const doc = {
      asyncapi: '3.0.0',
      info: {
        title: 'Vehicle Models',
        version: '1.0.0'
      },
      components: {
        messages: {
          Garage: {
            payload: {
              $ref: '#/components/schemas/Garage'
            }
          },
          Vehicle: {
            payload: {
              $ref: '#/components/schemas/Vehicle'
            }
          }
        },
        schemas: {
          Garage: {
            title: 'Garage',
            type: 'object',
            properties: {
              favorite: {
                $ref: '#/components/schemas/Vehicle'
              },
              vehicles: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Vehicle'
                }
              }
            }
          },
          Vehicle: {
            title: 'Vehicle',
            type: 'object',
            oneOf: [
              { $ref: '#/components/schemas/Car' },
              { $ref: '#/components/schemas/Truck' }
            ]
          },
          VehicleBase: {
            title: 'VehicleBase',
            type: 'object',
            discriminator: 'vehicleType',
            properties: {
              vehicleType: {
                title: 'VehicleType',
                type: 'string'
              },
              length: {
                type: 'number',
                format: 'float'
              }
            },
            required: ['vehicleType']
          },
          Car: {
            allOf: [
              { $ref: '#/components/schemas/VehicleBase' },
              {
                type: 'object',
                properties: {
                  vehicleType: {
                    const: 'Car'
                  }
                }
              }
            ]
          },
          Truck: {
            allOf: [
              { $ref: '#/components/schemas/VehicleBase' },
              {
                type: 'object',
                properties: {
                  vehicleType: {
                    const: 'Truck'
                  }
                }
              }
            ]
          }
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should always set alias', async () => {
    const doc = {
      title: 'AliasTest',
      type: 'object',
      required: ['testAlias'],
      properties: {
        testAlias: {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should render Literal type for const properties', async () => {
    const doc = {
      title: 'ConstTest',
      type: 'object',
      properties: {
        country: {
          const: 'United States of America'
        },
        version: {
          const: 42
        },
        isActive: {
          const: true
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should escape quotes in const string values', async () => {
    const doc = {
      title: 'QuoteTest',
      type: 'object',
      properties: {
        greeting: {
          const: "it's working"
        },
        path: {
          const: 'C:\\Users\\test'
        },
        quoted: {
          const: 'say "hello"'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should escape control characters, mixed quotes, and trailing backslashes in const string values', async () => {
    const doc = {
      title: 'ConstStringEdgeTest',
      type: 'object',
      properties: {
        alreadyQuoted: {
          type: 'string',
          const: "'xxx'"
        },
        bothQuotesAndBackslash: {
          type: 'string',
          const: 'a\'b"c\\d'
        },
        trailingBackslash: {
          type: 'string',
          const: 'C:\\Users\\test\\'
        },
        multiline: {
          type: 'string',
          const: 'line1\nline2\r\n\tindented\0end'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    const result = models[0].result;
    expect(result).toContain(
      `already_quoted: Literal["'xxx'"] = Field(default="'xxx'", frozen=True, alias='''alreadyQuoted''')`
    );
    expect(result).toContain(
      `both_quotes_and_backslash: Literal["a'b\\"c\\\\d"] = Field(default="a'b\\"c\\\\d", frozen=True, alias='''bothQuotesAndBackslash''')`
    );
    expect(result).toContain(
      `trailing_backslash: Literal['C:\\\\Users\\\\test\\\\'] = Field(default='C:\\\\Users\\\\test\\\\', frozen=True, alias='''trailingBackslash''')`
    );
    expect(result).toContain(
      `multiline: Literal['line1\\nline2\\r\\n\\tindented\\x00end'] = Field(default='line1\\nline2\\r\\n\\tindented\\x00end', frozen=True)`
    );
  });

  test('should format falsy, null, float, composite, and triple-quote edge cases into valid Python', async () => {
    const doc = {
      title: 'ConstEdgeTypesTest',
      type: 'object',
      properties: {
        constFalse: {
          type: 'boolean',
          const: false
        },
        constZero: {
          type: 'integer',
          const: 0
        },
        constEmpty: {
          type: 'string',
          const: ''
        },
        constNull: {
          type: 'null',
          const: null
        },
        constFloat: {
          type: 'number',
          const: 3.14
        },
        constArray: {
          type: 'array',
          const: [1, "it's", true, null]
        },
        trailingQuoteDesc: {
          type: 'string',
          description: "has ''' inside and ends with '"
        },
        onlyTripleQuotesDesc: {
          type: 'string',
          description: "'''"
        },
        trailingTripleQuotesDesc: {
          type: 'string',
          description: "abc'''"
        },
        quadQuotesDesc: {
          type: 'string',
          description: "''''"
        },
        carriageReturnDesc: {
          type: 'string',
          description: 'a\rb'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    const result = models[0].result;
    expect(result).toContain(
      `const_false: Literal[False] = Field(default=False, frozen=True, alias='''constFalse''')`
    );
    expect(result).toContain(
      `const_zero: Literal[0] = Field(default=0, frozen=True, alias='''constZero''')`
    );
    expect(result).toContain(
      `const_empty: Literal[''] = Field(default='', frozen=True, alias='''constEmpty''')`
    );
    expect(result).toContain(
      `const_null: Literal[None] = Field(default=None, frozen=True, alias='''constNull''')`
    );
    expect(result).toContain(
      `const_float: Optional[float] = Field(default=3.14, frozen=True, alias='''constFloat''')`
    );
    expect(result).toContain(
      `const_array: Optional[List[Any]] = Field(default=[1, "it's", True, None], frozen=True, alias='''constArray''')`
    );
    expect(result).toContain(
      `trailing_quote_desc: Optional[str] = Field(description='''has \\'\\'\\' inside and ends with \\'''', default=None, alias='''trailingQuoteDesc''')`
    );
    expect(result).toContain(
      `only_triple_quotes_desc: Optional[str] = Field(description='''\\'\\'\\'''', default=None, alias='''onlyTripleQuotesDesc''')`
    );
    expect(result).toContain(
      `trailing_triple_quotes_desc: Optional[str] = Field(description='''abc\\'\\'\\'''', default=None, alias='''trailingTripleQuotesDesc''')`
    );
    expect(result).toContain(
      `quad_quotes_desc: Optional[str] = Field(description='''\\'\\'\\'\\'''', default=None, alias='''quadQuotesDesc''')`
    );
    expect(result).toContain(
      `carriage_return_desc: Optional[str] = Field(description='''a\\rb''', default=None, alias='''carriageReturnDesc''')`
    );
  });
});
