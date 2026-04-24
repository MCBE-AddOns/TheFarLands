import {
    system, world
}
    from '@minecraft/server';

class dynamicProperty {
    constructor(source,name) {
        this.source = source
        this.name = name
    }
    get var() {
        return this.source.getDynamicProperty(this.name)
    }
    set var(value) {
        this.source.setDynamicProperty(this.name,value)
    }
}

world.afterEvents.playerSpawn.subscribe((eventData) => {
    const { initialSpawn, player } = eventData;
    if (initialSpawn) {
        let firstJoinToWorld = new dynamicProperty(world,"firstJoinToWorld")
        firstJoinToWorld.var??=false

        system.runTimeout(() => {


            if (!(player.hasTag("firstJoin"))) {
                player.addTag("firstJoin")
            }
            if (!firstJoinToWorld.var) {
                player.runCommand(`setblock 105814 218 105814 redstone_block`);
                firstJoinToWorld.var = true
            }


        }, 1000);

    }
});

world.afterEvents.entitySpawn.subscribe((event) => {
    const { entity } = event
    if (entity.typeId === "minecraft:item") {
        const item = entity.getComponent("minecraft:item").itemStack
        if (item.typeId == "farlands:e_p_a_l_l") {
            entity.addTag("e_p_a_l_l")
        }
    }
})

system.runInterval(() => {
    let players = world.getPlayers();
    players.map(player => {
        let block = player.dimension.getBlock(Object.fromEntries("xyz".split("").map(xyz => {
            return [
                xyz,
                player.location[xyz] - (xyz === "y")
            ]
        })))
        if (block.typeId === "farlands:farlands_portal") {
            let tpOrigin = new dynamicProperty(player,"tpOrigin");
            

            let obj = Object.fromEntries("xyz".split("").map(xyz => {
                return [
                    xyz,
                    Math.round(player.location[xyz]) + (xyz === "y") * 2
                ]
            }))
            tpOrigin.var = obj

            let farlandsPos = [
                [0,0,0],
                [105476,256,105476],
                [105476,256,-105476],
                [105476,256,105476],
                [-105476,256,-105476]
            ]
            player.teleport(Object.fromEntries("xyz".split("").map((xyz,index) => {
                return [
                    xyz,
                    farlandsPos[Math.floor(Math.random()*4)+1][index]
                ]
            })))
            player.runCommand(`effect @s slow_falling 60 1 true`)
        }
    })
})

world.afterEvents.itemUse.subscribe((eventData) => {
    const { itemStack, source } = eventData;
    if (source.typeId === "minecraft:player" && itemStack.typeId === "farlands:e_p_a_l_l") {
        let player = source;
        let tpOrigin = new dynamicProperty(player,"tpOrigin");
        if (tpOrigin.var !== undefined) {
            player.teleport(tpOrigin.var)
        }
        system.runTimeout(() => {
            player.runCommand(`clear @s farlands:e_p_a_l_l 0 1`)
            player.runCommand(`playsound mob.endermen.portal @s ~~~`)
            player.runCommand(`spreadplayers ~ ~ 3 5 @s`)
            player.runCommand(`effect @s slow_falling 60 1 true`)
        },3)
    }
})