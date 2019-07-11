const jwt = require('jsonwebtoken');

const verificarToken = ( req, res, next ) => {
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        };
        
        req.usuario = decoded.usuario;
        next();
    });
}

const verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'Servicio valido solo para admins'
        })
    }


}

module.exports = {
    verificarToken, verificaAdminRole
};