const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Usuario } = require("../model/modelos");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "senha" },
    async (email, senha, done) => {
      try {
        const email_normalizado = (email || "").trim().toLowerCase();
        const usuario = await Usuario.findOne({
          where: { email: email_normalizado },
        });
        if (!usuario)
          return done(null, false, { message: "Credenciais inválidas" });

        const senha_valida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senha_valida)
          return done(null, false, { message: "Credenciais inválidas" });

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((usuario, done) => done(null, usuario.id));
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findByPk(id);
    return done(null, usuario || false);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;
