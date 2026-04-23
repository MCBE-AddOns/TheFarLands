
gamerule commandblockoutput false
gamerule sendcommandfeedback false
scoreboard objectives add random_tp dummy
playsound farlands.farlands_portal @a ~~~
kill @e[type=item,tag=e_p_a_l_l]
particle farlands:farlands_portal ~~~
fill ~1 ~ ~-1 ~ ~ ~ farlands:farlands_portal replace water
