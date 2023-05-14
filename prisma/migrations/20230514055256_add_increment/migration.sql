-- DropIndex
DROP INDEX "Movie_id_key";

-- AlterTable
CREATE SEQUENCE movie_id_seq;
ALTER TABLE "Movie" ALTER COLUMN "id" SET DEFAULT nextval('movie_id_seq');
ALTER SEQUENCE movie_id_seq OWNED BY "Movie"."id";
