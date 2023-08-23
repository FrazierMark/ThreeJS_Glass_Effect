import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TV
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('tv')
        }

        // Resource
        this.resource = this.resources.items.tvModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1.0, 1.0, 1.0)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}