const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb').ObjectID;
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todosSeed, populateTodos, usersSeed, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test data for POST /todos';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) { 
                    return done(err); 
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create invalid todo (body data)', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todosSeed[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosSeed[0].text)
                
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todosSeed[2]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo).toNotExist;
                    done();
                }).catch((e) => {
                    done(e);
                });
                //query db using findById toNotExist
                //expect(null).toNotExist();
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        var hexID = todosSeed[0]._id.toHexString();
        var text = 'Test todo 1, updated';

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeTruthy();
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexID = todosSeed[2]._id.toHexString();
        var text = 'Test todo 3, updated';

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersSeed[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersSeed[0]._id.toHexString());
                expect(res.body.email).toBe(usersSeed[0].email);    
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'test123!!!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist;
                expect(res.body._id).toExist;
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist;
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'invalid';
        var password = 'abc';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).not.toExist;
                    done();
                });
            });
    });

    it('should not create user if e-mail in use', (done) => {
        var email = usersSeed[0].email;
        var password = 'validPassword123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.find({email}).then((users) => {
                    expect(users.length).toBe(1);
                    done();
                });
            });
    })
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: usersSeed[1].email,
                password: usersSeed[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist;
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(usersSeed[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'invalid@invalidate.com',
                password: 'invalidPassword!'
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(usersSeed[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    })
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        var token = usersSeed[0].tokens[0].token;

        request(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(usersSeed[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});