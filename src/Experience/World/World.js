import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Galaxy from './Galaxy.js'
import Rabbit from './Rabbit.js'
import TV from './TV.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            //this.floor = new Floor()
            //this.fox = new Fox()
            //this.rabbit = new Rabbit()
            this.tv = new TV()
            this.environment = new Environment()
            this.galaxy = new Galaxy()

        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
    }
}