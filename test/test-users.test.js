const { faker } = require('@faker-js/faker');
const supertest = require("supertest");

const request = require('supertest')

const baseUrl = "http://localhost:3000"

describe("suite de teste da api users", ()=> {


    const jsonNovoUsuario = {
        nome: faker.person.firstName(),
        telefone: faker.phone.number(),
        email: faker.internet.email(),
        senha: faker.internet.password()
     }


    it("consultar todos os usuarios deve retornar 200", async()=>{
        const response = await request(baseUrl).get("/users")
        expect(response.status).toBe(200)
    })

    it("consultar um usuario deve retornar 200", async()=>{
        const response = await request(baseUrl).get("/users/7")
        expect(response.body.nome).toEqual("Carol10");
        expect(response.body.telefone).toEqual('3442-333901-81768');
        expect(response.body.email).toEqual('teste@exemplo.com');
        expect(response.status).toEqual(200);

    })

    it("adicionar um usuario deve retornar 200", async()=>{
        const response = await request(baseUrl).post("/users").send(jsonNovoUsuario)
        expect(response.status).toBe(200)

    })

    it("adicionar um usuario com emso email retornar 422", async()=>{
        const response = await request(baseUrl).post("/users").send(jsonNovoUsuario)
        expect(response.body.error).toEqual("E-mail já está em uso");
        expect(response.status).toBe(422)
    })
    it("adicionar um usuario com sem dados retornar 422", async()=>{
        const response = await request(baseUrl).post("/users").send({nome:"teste"})

        expect(JSON.stringify(response.body)).toBe('{"error":"Os seguintes campos são obrigatórios: telefone, email, senha"}')
        expect(response.body.error).toEqual("Os seguintes campos são obrigatórios: telefone, email, senha")
        expect(response.status).toBe(422)
    })


    it("editar um usuario deve retornar 200", async()=>{
        const response = await request(baseUrl).put("/users/8").send(jsonNovoUsuario)
        expect(response.body.nome).toBe(jsonNovoUsuario.nome);
        expect(response.body.telefone).toBe(jsonNovoUsuario.telefone);
        expect(response.body.email).toBe("exemplo1@exemplo.com");
        expect(response.status).toBe(200)
    })

    it("editar um usuario invalido deve retornar 404", async()=>{
        const response = await request(baseUrl).put("/users/1").send(jsonNovoUsuario)
        expect(response.body.error).toEqual("Usuário não encontrado");
        expect(response.status).toBe(404)
    })

    it("deletar um usuario invalido deve retornar 204", async()=>{
        const response = await request(baseUrl).delete("/users/4")
        expect(response.status).toBe(204)
    })

    it("deletar um usuario deve retornar 204", async()=>{
        const responsePOST = await request(baseUrl).post("/users").send(jsonNovoUsuario)
        const id = responsePOST.body.id
        const responseDELETE = await request(baseUrl).delete(`/users/${id}`)
        expect(responseDELETE.status).toBe(204)
    })
})