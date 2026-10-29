/*
  Warnings:

  - You are about to drop the column `categoria` on the `grupos` table. All the data in the column will be lost.
  - You are about to drop the column `precioMensual` on the `grupos` table. All the data in the column will be lost.
  - You are about to drop the column `comentarios` on the `inscripciones` table. All the data in the column will be lost.
  - You are about to drop the column `edadDeportista` on the `inscripciones` table. All the data in the column will be lost.
  - You are about to drop the column `nombreDeportista` on the `inscripciones` table. All the data in the column will be lost.
  - Added the required column `bio` to the `entrenadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaClave` to the `grupos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dias` to the `grupos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `grupos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aceptaDatos` to the `inscripciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `inscripciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edad` to the `inscripciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experiencia` to the `inscripciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreAspirante` to the `inscripciones` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Experiencia" AS ENUM ('NINGUNA', 'MENOS_DE_UN_ANIO', 'MAS_DE_UN_ANIO');

-- AlterTable
ALTER TABLE "entrenadores" ADD COLUMN     "bio" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "grupos" DROP COLUMN "categoria",
DROP COLUMN "precioMensual",
ADD COLUMN     "categoriaClave" TEXT NOT NULL,
ADD COLUMN     "dias" TEXT NOT NULL,
ADD COLUMN     "precio" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "inscripciones" DROP COLUMN "comentarios",
DROP COLUMN "edadDeportista",
DROP COLUMN "nombreDeportista",
ADD COLUMN     "aceptaDatos" BOOLEAN NOT NULL,
ADD COLUMN     "correo" TEXT NOT NULL,
ADD COLUMN     "edad" INTEGER NOT NULL,
ADD COLUMN     "experiencia" "Experiencia" NOT NULL,
ADD COLUMN     "mensaje" VARCHAR(300),
ADD COLUMN     "nombreAcudiente" TEXT,
ADD COLUMN     "nombreAspirante" TEXT NOT NULL,
ADD COLUMN     "permisoAcudiente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telefonoAcudiente" TEXT;

-- CreateTable
CREATE TABLE "categorias" (
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edades" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "trabajo" TEXT[],
    "torneos" TEXT[],

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("clave")
);

-- CreateIndex
CREATE INDEX "grupos_categoriaClave_idx" ON "grupos"("categoriaClave");

-- CreateIndex
CREATE INDEX "inscripciones_userId_idx" ON "inscripciones"("userId");

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_categoriaClave_fkey" FOREIGN KEY ("categoriaClave") REFERENCES "categorias"("clave") ON DELETE RESTRICT ON UPDATE CASCADE;
