module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      povrsina: String,
      duzina: String,
      sirina: String,
      wifi: Boolean,
      parking: Boolean,
      struja: Boolean,
      published: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Parcela = mongoose.model("parcela", schema);
  return Parcela;
};
