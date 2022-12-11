db.createUser({
    user: "cool",
    pwd: "cool",
    roles: [{
        role: "root",
        db: "admin"
    }]
});