const misCounter = {
    bsonType: "object",
    properties: {
      _id: { bsonType: "string" },
      sequence_value: { bsonType: "int" }
    }
  };

  const misIntial={
    _id: "trackingId",
    sequence_value: 1
  }

  module.exports = {misCounter, misIntial};
  