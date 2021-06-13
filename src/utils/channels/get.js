const ApiError = require("../../helpers/ApiError"),
    auth = require("../../middlewares/authorization"),
    CheckAuth = require("../../middlewares/jwt"),
    guilds = require("../../models/guild.model"),
    user = require("../../models/user.model"),
    channels = require("../../models/channel.model"),
    bcrypt = require("bcrypt");
module.exports = (r => {
    r.get("/channels/:channelid", auth, async (r, s) => {
        if (!r.params) return s.status(400).json(ApiError.badrequest);
        if (!r.password) return s.status(401).json(ApiError.unauthorized);
        const {
            channelid: e
        } = r.params, {
            nsfw: i,
            password: t
        } = r.body, o = r.headers.authorization || r.signedCookies.Authorization;
        let n = require("../../../middlewares/jwt")(o, r.password);
        if (!n.ID) return s.status(401).json(ApiError.unauthorized);
        user.findById(n.ID, (r, o) => r ? s.send(ApiError.error).status(500) : o ? void channels.findById(e, (r, e) => r ? s.send(ApiError.error).status(500) : e ? !e.nsfw || i && 1 == i ? void(null != e.password ? (null == t && s.send(ApiError.unauthorized).status(401), bcrypt.compare(t, e.password, (r, i) => {
            if (r) return s.send(ApiError.error).status(500);
            i ? s.json({
                _id: e._id,
                name: e.name,
                description: e.description,
                author: e.author,
                type: e.type,
                permissions: e.permissions,
                position: e.position,
                CreatedAt: e.CreatedAt,
                messages: e.messages
            }) : s.send(ApiError.unauthorized).status(401)
        })) : s.json({
            _id: e._id,
            name: e.name,
            description: e.description,
            author: e.author,
            type: e.type,
            permissions: e.permissions,
            position: e.position,
            CreatedAt: e.CreatedAt,
            messages: e.messages
        })) : s.send(ApiError.forbidden).send(403) : s.send(ApiError.badrequest).status(400)) : s.send(ApiError.unauthorized).status(401));
        let d = await guilds.findById(code);
        return d ? await d.members.find(r => r.user.id === n.ID) ? s.status(200).json(d) : s.status(403).json(ApiError.forbidden) : s.status(404).json(ApiError.notfound)
    })
});
