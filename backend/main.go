package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-playground/locales/es"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	estranslations "github.com/go-playground/validator/v10/translations/es"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Producto struct {
	ID          uint      `json:"id"`
	Nombre      string    `json:"nombre" validate:"required,min=5"`
	Imagen      string    `json:"imagen" validate:"required"`
	Precio      uint      `json:"precio" validate:"required,min=1"`
	Descripcion string    `json:"descripcion" validate:"required,min=50,max=500"`
	Cantidad    uint      `json:"cantidad" validate:"required,min=1"`
	EnPromocion bool      `json:"enPromocion" validate:"boolean"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Usuario struct {
	ID        uint      `json:"id"`
	Correo    string    `json:"correo" validate:"required,email"`
	Clave     string    `json:"clave" validate:"required,min=6"`
	Rol       byte      `json:"rol"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

const apiKey = "VBwvZYa36ejLOOVD6X5cfbMAEDCIwIgR"

func setupDatabase() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("vfresco.db"), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&Usuario{}, &Producto{})

	var productCount int64
	db.Model(&Producto{}).Count(&productCount)
	if productCount == 0 {
		agent := fiber.Get("https://raw.githubusercontent.com/gabrieldavid98/frontend-data/main/data.json")
		_, body, errs := agent.Bytes()
		if len(errs) > 0 {
			log.Fatalln(errs)
		}

		var pp []*Producto
		err := json.Unmarshal(body, &pp)
		if err != nil {
			log.Fatalln(err)
		}

		r := db.Create(pp)
		if r.Error != nil {
			log.Fatalln(r.Error)
		}
	}

	var userCount int64
	db.Model(&Usuario{}).Count(&userCount)
	if userCount == 0 {
		user := Usuario{
			Correo: "admin@vfresco.com",
			Clave:  "123456a",
			Rol:    1,
		}

		r := db.Create(&user)
		if r.Error != nil {
			log.Fatalln(r.Error)
		}
	}

	return db
}

func validateAPIKey(c *fiber.Ctx, key string) (bool, error) {
	hashedAPIKey := sha256.Sum256([]byte(apiKey))
	hashedKey := sha256.Sum256([]byte(key))

	if subtle.ConstantTimeCompare(hashedAPIKey[:], hashedKey[:]) == 1 {
		return true, nil
	}

	return false, fiber.ErrUnauthorized
}

func main() {

	es := es.New()
	uni := ut.New(es, es)
	trans, _ := uni.GetTranslator("es")
	validate := validator.New(validator.WithRequiredStructEnabled())
	estranslations.RegisterDefaultTranslations(validate, trans)

	app := fiber.New()

	db := setupDatabase()

	app.Use(logger.New())
	app.Use(cors.New())

	app.Post("/login", func(c *fiber.Ctx) error {
		u := new(Usuario)

		if err := c.BodyParser(u); err != nil {
			return err
		}

		err := validate.Struct(u)
		if err != nil {
			var errs []fiber.Map
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, fiber.Map{
					"field": err.Field(),
					"error": err.Translate(trans),
				})
			}

			return c.Status(http.StatusBadRequest).JSON(errs)
		}

		var cu Usuario
		r := db.Where("Correo = ? AND Clave = ?", u.Correo, u.Clave).Find(&cu)
		if r.Error != nil {
			return c.Status(http.StatusInternalServerError).SendString(r.Error.Error())
		}

		if r.RowsAffected == 0 {
			return fiber.ErrNotFound
		}

		return c.JSON(fiber.Map{
			"apiKey": apiKey,
			"id":     cu.ID,
			"email":  cu.Correo,
			"role":   cu.Rol,
		})
	})

	app.Get("/products", func(c *fiber.Ctx) error {
		var pp []Producto
		db.Find(&pp)
		return c.JSON(pp)
	})

	app.Get("/products/:id<int>", func(c *fiber.Ctx) error {
		var p Producto
		r := db.Find(&p, c.Params("id", "0"))
		if r.RowsAffected == 0 {
			return fiber.ErrNotFound
		}

		return c.JSON(p)
	})

	app.Use(keyauth.New(keyauth.Config{
		Validator: validateAPIKey,
	}))

	app.Post("/products", func(c *fiber.Ctx) error {
		p := new(Producto)

		if err := c.BodyParser(p); err != nil {
			return err
		}

		err := validate.Struct(p)
		if err != nil {
			var errs []fiber.Map
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, fiber.Map{
					"field": err.Field(),
					"error": err.Translate(trans),
				})
			}

			return c.Status(http.StatusBadRequest).JSON(errs)
		}

		r := db.Create(p)
		if r.Error != nil {
			return c.Status(http.StatusInternalServerError).SendString(r.Error.Error())
		}

		return c.JSON(p)
	})

	app.Put("/products/:id<int>", func(c *fiber.Ctx) error {
		p := new(Producto)

		if err := c.BodyParser(p); err != nil {
			return err
		}

		err := validate.Struct(p)
		if err != nil {
			var errs []fiber.Map
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, fiber.Map{
					"field": err.Field(),
					"error": err.Translate(trans),
				})
			}

			return c.Status(http.StatusBadRequest).JSON(errs)
		}

		var cp Producto
		r := db.Find(&cp, c.Params("id", "0"))
		if r.Error != nil {
			return c.Status(http.StatusInternalServerError).SendString(r.Error.Error())
		}

		if r.RowsAffected == 0 {
			return fiber.ErrNotFound
		}

		modified := false

		if cp.Nombre != p.Nombre {
			cp.Nombre = p.Nombre
			modified = true
		}

		if cp.Imagen != p.Imagen {
			cp.Imagen = p.Imagen
			modified = true
		}

		if cp.Precio != p.Precio {
			cp.Precio = p.Precio
			modified = true
		}

		if cp.Descripcion != p.Descripcion {
			cp.Descripcion = p.Descripcion
			modified = true
		}

		if cp.Cantidad != p.Cantidad {
			cp.Cantidad = p.Cantidad
			modified = true
		}

		if cp.EnPromocion != p.EnPromocion {
			cp.EnPromocion = p.EnPromocion
			modified = true
		}

		if !modified {
			return c.JSON(cp)
		}

		r = db.Save(&cp)
		if r.Error != nil {
			return c.Status(http.StatusInternalServerError).SendString(r.Error.Error())
		}

		return c.JSON(cp)
	})

	app.Delete("/products/:id<int>", func(c *fiber.Ctx) error {
		var p Producto
		r := db.Find(&p, c.Params("id", "0"))
		if r.RowsAffected == 0 {
			return fiber.ErrNotFound
		}

		r = db.Delete(&p)
		if r.Error != nil {
			return c.Status(http.StatusInternalServerError).SendString(r.Error.Error())
		}

		return c.JSON(p)

	})

	log.Fatalln(app.Listen(":7000"))
}
