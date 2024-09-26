const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../Models/User');

const router = express.Router();

// @route   POST /api/register
// @desc    Registrar um novo usuário
router.post(
    '/register',
    [
        check('name', 'Nome é obrigatório').not().isEmpty(),
        check('email', 'Por favor, insira um email válido').isEmail(),
        check('password', 'A senha deve ter pelo menos 6 caracteres').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Verifica se o usuário já existe
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'Usuário já existe' });
            }

            user = new User({
                name,
                email,
                password
            });

            // Criptografa a senha
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Retorna o token JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
        }
    }
);

// @route   POST /api/login
// @desc    Login de usuário
router.post(
    '/login',
    [
        check('email', 'Por favor, insira um email válido').isEmail(),
        check('password', 'A senha é obrigatória').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Verifica se o usuário existe
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Credenciais inválidas' });
            }

            // Compara a senha
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Credenciais inválidas' });
            }

            // Retorna o token JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
        }
    }
);

module.exports = router;
