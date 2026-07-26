{
  "entities": {
    "UserCharacter": {
      "title": "User Character Data",
      "description": "Stores user character sheet, stats, skills, designios, and account data",
      "type": "object",
      "properties": {
        "username": { "type": "string", "description": "Unique username" },
        "password": { "type": "string", "description": "Account password" },
        "role": { "type": "string", "description": "Role: user or admin" },
        "characterName": { "type": "string", "description": "Character name" },
        "animalId": { "type": "string", "description": "Animal guardian ID" },
        "xpTotal": { "type": "number", "description": "Total XP earned" },
        "attributes": {
          "type": "object",
          "description": "Character attributes"
        },
        "unlockedSkillIds": {
          "type": "array",
          "description": "Unlocked skill IDs"
        },
        "userSkillRanks": {
          "type": "object",
          "description": "User skill ranks map"
        },
        "purchasedCombatStats": {
          "type": "object",
          "description": "Purchased combat stats"
        },
        "userDesignios": {
          "type": "object",
          "description": "Purchased designios"
        },
        "notes": { "type": "string", "description": "Character notes" },
        "updatedAt": { "type": "string", "description": "Last updated timestamp" }
      },
      "required": ["username", "role"]
    },
    "SystemConfig": {
      "title": "System Configuration",
      "description": "Global system configurations, XP costs, and custom skill definitions",
      "type": "object",
      "properties": {
        "xpConfig": { "type": "object", "description": "Global XP configuration" },
        "customSkills": { "type": "object", "description": "Custom skill definitions map" },
        "designiosList": { "type": "array", "description": "Global designios list" },
        "updatedAt": { "type": "string", "description": "Last update timestamp" }
      }
    }
  },
  "firestore": {
    "/users/{username}": {
      "schema": { "$ref": "#/entities/UserCharacter" },
      "description": "User account and character sheet data"
    },
    "/system/{configId}": {
      "schema": { "$ref": "#/entities/SystemConfig" },
      "description": "Global settings, custom skills and designios"
    }
  }
}
