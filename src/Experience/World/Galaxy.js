import * as THREE from 'three'
import Experience from '../Experience'
import galaxyFragmentShader from '../../shaders/galaxy/fragment.glsl'
import galaxyVertexShader from '../../shaders/galaxy/vertex.glsl'


export default class Galaxy
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('parameters')
        }

        this.setParams()
        this.generateGalaxy()
        this.setDebugParameters()

    }

    setParams() {
      this.parameters = {
          count: 200000,
          size: 0.005,
          radius: 5,
          branches: 3,
          spin: 1,
          randomness: 0.2,
          randomnessPower: 3,
          insideColor: '#ff6030',
          outsideColor: '#1b3984',
      };
      this.geometry = null;
      this.material = null;
      this.points = null;
  }
  
  generateGalaxy() {
    if(this.points !== null)
    {
        this.points.geometry.dispose();
        this.geometry.dispose()
        this.material.dispose()
        this.scene.remove(this.points)
    }

    /**
     * Geometry
     */
    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.parameters.count * 3)
    const randomness = new Float32Array(this.parameters.count * 3)
    const colors = new Float32Array(this.parameters.count * 3)
    const scales = new Float32Array(this.parameters.count * 1)

    const insideColor = new THREE.Color(this.parameters.insideColor)
    const outsideColor = new THREE.Color(this.parameters.outsideColor)

    for(let i = 0; i < this.parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        const radius = Math.random() * this.parameters.radius

        const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
        const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius

        positions[i3    ] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius
    
        randomness[i3    ] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / this.parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Scale
        scales[i] = Math.random()
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    /**
     * Material
     */
    this.material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:
        {
            uTime: { value: 0 },
            uSize: { value: 30 * this.renderer.instance.getPixelRatio() }
        },    
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader
    })

        // Points
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }

    update() {
        // Update the uTime uniform in the material
        if (this.material) {
            this.material.uniforms.uTime.value = this.time.elapsed;
        }
    }

    setDebugParameters() {
        if (this.debug.active) {
            this.debugFolder
                .add(this.parameters, 'count').name('particle count').min(100).max(1000000).step(100).onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .add(this.parameters, 'radius').name('galaxy radius').min(0.01).max(20).step(0.01).onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .add(this.parameters, 'branches').name('galaxy branches').min(2).max(20).step(1).onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .add(this.parameters, 'randomness').name('galaxy randomness').min(0).max(2).step(0.001).onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .add(this.parameters, 'randomnessPower').name('randomness power').min(1).max(10).step(0.001).onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .addColor(this.parameters, 'insideColor').name('inside color').onFinishChange(() => this.generateGalaxy())
            this.debugFolder
                .addColor(this.parameters, 'outsideColor').name('outside color').onFinishChange(() => this.generateGalaxy())
        }
    }

    dispose() {
        if (this.points) {
            this.points.geometry.dispose();
            this.points.material.dispose();
            this.scene.remove(this.points);
            this.points = null;
        }
    }
}