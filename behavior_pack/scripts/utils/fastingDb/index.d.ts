import { Entity, World } from "@minecraft/server";

type DbStorageType = World | Entity




interface PropertyFormat {
    link: PropertyFormat | undefined
    data: unknown
}