/**
 * @swagger
 * components:
 *   securitySchemes:
 *     # Definição de autenticação Bearer JWT
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     # ============================================================
 *     # DTOs de ENTRADA
 *     # ============================================================
 *
 *     RegisterUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - birthDate
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário.
 *           example: "Pedro Alves"
 *         email:
 *           type: string
 *           format: email
 *           description: Email único para login.
 *           example: "pedro@email.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha com no mínimo 6 caracteres.
 *           example: "senha123"
 *         phone:
 *           type: string
 *           description: Telefone do usuário.
 *           example: "34999998888"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento (YYYY-MM-DD).
 *           example: "1990-10-28"
 *
 *     UpdateUserDto:
 *       type: object
 *       description: Objeto para atualização de usuário (todos os campos opcionais).
 *       properties:
 *         name:
 *           type: string
 *           example: "Pedro Alves da Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "pedro.silva@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "novaSenha123"
 *         phone:
 *           type: string
 *           example: "34999997777"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-10-29"
 *         userType:
 *           type: string
 *           enum: [CLIENT, ADMIN]
 *           description: Apenas administradores podem alterar.
 *
 *     AuthRequestDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "pedro@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *
 *     # ============================================================
 *     # OBJETOS DE RESPOSTA
 *     # ============================================================
 *
 *     User:
 *       type: object
 *       description: Representação pública do usuário (sem senha).
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           description: ID do usuário (retornado como string).
 *           example: "1"
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         userType:
 *           type: string
 *           enum: [CLIENT, ADMIN]
 *         birthDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNj..."
 *
 *     # ============================================================
 *     # RESPOSTAS PADRÃO
 *     # ============================================================
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro.
 *           example: "Email ou senha inválidos"
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso.
 *           example: "Logout realizado com sucesso"
 */
