"use client";
import React, { useRef, useState } from 'react';
import { ModelinaPlayground } from '@/components/PlaygroundComponent';

export default function ModelinaPlaygroundPage() {
  const [error, setError] = useState<any>();
  const playground = (
    <div>
      <div className="relative pt-16 pb-8 hidden lg:block">
        <h4 className="text-center">
          Try it now
        </h4>

        <ModelinaPlayground onError={setError} />
      </div>
    </div>
  );

  return (
    <div className="py-16 overflow-hidden lg:py-24">
      <div>
        {playground}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
          <strong className="font-bold mr-4">Error!</strong>
          <span className="block sm:inline">{typeof error.toString === 'function' ? error.toString() : error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-2">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => {setError(undefined)}}><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}
    </div>
  )
}

const exampleModelinaCode = `import { JavaGenerator, JAVA_COMMON_PRESET } from '@asyncapi/modelina'
  
const generator = new JavaGenerator({
  collectionType: "List",
  presets: [
    {
      preset: JAVA_COMMON_PRESET,
      options: {
        classToString: true
      }
    }
  ]
});

// const input = ...AsyncAPI document
const models = await generator.generate(input)`;

const exampleOutputModel = `import java.util.List;
import java.util.Map;

public class LightMeasured {
  private Integer id;
  private Integer lumens;
  private java.time.OffsetDateTime sentAt;
  private Map<String, Object> additionalProperties;

  public Integer getId() { return this.id; }
  public void setId(Integer id) { this.id = id; }

  public Integer getLumens() { return this.lumens; }
  public void setLumens(Integer lumens) { this.lumens = lumens; }

  public java.time.OffsetDateTime getSentAt() { return this.sentAt; }
  public void setSentAt(java.time.OffsetDateTime sentAt) { this.sentAt = sentAt; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }

  @Override
  public String toString() {
    return "class LightMeasured {\\n" +   
      "    id: " + toIndentedString(id) + "\\n" +
      "    lumens: " + toIndentedString(lumens) + "\\n" +
      "    sentAt: " + toIndentedString(sentAt) + "\\n" +
      "    additionalProperties: " + toIndentedString(additionalProperties) + "\\n" +
    "}";
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\\n", "\\n    ");
  }
}`;

const playgroundAsyncAPIDocument = {
  "asyncapi": "2.3.0",
  "info": {
    "title": "Streetlights API",
    "version": "1.0.0",
    "description": "The Smartylighting Streetlights API allows you\nto remotely manage the city lights.\n",
    "license": {
      "name": "Apache 2.0",
      "url": "https://www.apache.org/licenses/LICENSE-2.0"
    }
  },
  "servers": {
    "mosquitto": {
      "url": "mqtt://test.mosquitto.org",
      "protocol": "mqtt"
    }
  },
  "channels": {
    "light/measured": {
      "publish": {
        "summary": "Inform about environmental lighting conditions for a particular streetlight.",
        "operationId": "onLightMeasured",
        "message": {
          "name": "LightMeasured",
          "payload": {
            "type": "object",
            "$id": "LightMeasured",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 0,
                "description": "Id of the streetlight."
              },
              "lumens": {
                "type": "integer",
                "minimum": 0,
                "description": "Light intensity measured in lumens."
              },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time when the message was sent."
              }
            }
          }
        }
      }
    },
    "turn/on": {
      "subscribe": {
        "summary": "Command a particular streetlight to turn the lights on or off.",
        "operationId": "turnOn",
        "message": {
          "name": "TurnOn",
          "payload": {
            "type": "object",
            "$id": "TurnOn",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 0,
                "description": "Id of the streetlight."
              },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time when the message was sent."
              }
            }
          }
        }
      }
    }
  }
}