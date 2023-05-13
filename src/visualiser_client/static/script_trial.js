const { shapes, util, dia, anchors } = joint;

let input_list = [{
    "name": "outer_comp_1",
    "type": "component",
    "ports": [
        {
            "name": "top",
            "location": "top",
            "pins": [
                {
                    "name": "vcc",
                }
            ]
        },
        {
            "name": "bottom",
            "location": "bottom",
            "pins": [
                {
                    "name": "gnd",
                }
            ]
        },
    ],
    "links": []},
    {
    "name": "main_module",
    "type": "module",
    "modules": [
        {
            "name": "inner_comp_1",
            "type": "component",
            "ports": [
                {
                    "name": "top",
                    "location": "left",
                    "pins": [
                        {
                            "name": "vcc",
                        }
                    ]
                },
                {
                    "name": "bottom",
                    "location": "right",
                    "pins": [
                        {
                            "name": "gnd",
                        }
                    ]
                },
            ],
            "links": []
        },
        {
            "name": "inner_comp_2",
            "type": "component",
            "ports": [
                {
                    "name": "top",
                    "location": "left",
                    "pins": [
                        {
                            "name": "vcc",
                        }
                    ]
                },
                {
                    "name": "bottom",
                    "location": "right",
                    "pins": [
                        {
                            "name": "gnd",
                        }
                    ]
                },
            ],
            "links": []
        }
    ],
    "ports" : [],
    "links": [
        {
            "source": "inner_comp_1.vcc",
            "target": "inner_comp_2.gnd"
        }
    ]
    }
]

let settings_dict = {
    "paper": {
        "backgroundColor": 'rgba(0, 255, 0, 0.3)'
    },
    "component" : {
        "strokeWidth": 6,
        "fontSize": 10
    },
    "module" : {
        "strokeWidth": 4,
        "fontSize": 10
    }
}

class AtoElement extends dia.Element {
    defaults() {
        return {
            ...super.defaults,
            hidden: false
        };
    }

    isHidden() {
        return Boolean(this.get("hidden"));
    }

    static isAtoElement(shape) {
        return shape instanceof AtoElement;
    }
}

class AtoComponent extends AtoElement {
    defaults() {
        return {
            ...super.defaults(),
            type: "AtoComponent",
            size: { width: 200, height: 50 },
            attrs: {
                body: {
                    fill: "white",
                    z: 10,
                    stroke: "black",
                    strokeWidth: settings_dict["component"]["strokeWidth"],
                    width: "calc(w)",
                    height: "calc(h)",
                    rx: 5,
                    ry: 5
                },
                label: {
                    text: "Component",
                    fill: "black",
                    fontSize: settings_dict["component"]["fontSize"],
                    fontWeight: "bold",
                    textVerticalAnchor: "middle",
                    textAnchor: "middle",
                    fontFamily: "sans-serif",
                    x: "calc(w/2)",
                    y: "calc(h/2)"
                }
            }
        };
    }

    preinitialize() {
        this.markup = util.svg`
            <rect @selector="body" />
            <text @selector="label" />
        `;
    }

    addConnection(name, port) {
        this.addPort({ 
            group: port,
            attrs: { 
                label: { 
                    text: name,
                    fontFamily: "sans-serif",
                }
            }
        });
    }

    fitAncestorElements() {
        var padding = 40;
        this.fitParent({
            deep: true,
            padding: {
                top: padding,
                left: padding,
                right: padding,
                bottom: padding
            }
        });
    }

//     addPorts(port_list) {
//         for (let port of port_list) {
//             this.prop({ports: { // This section describes what a port looks like
//                 groups: {
//                     [port['name']]: {
//                     position: {
//                         name: 'right'
//                     },
//                     attrs: {
//                         portBody: {
//                             magnet: true,
//                             r: 5,
//                             fill: '#FFFFFF',
//                             stroke:'#023047'
//                         }
//                     },
//                     label: {
//                         position: {
//                             name: 'right',
//                             args: { y: 0 }
//                         },
//                         markup: [{
//                             tagName: 'text',
//                             selector: 'label',
//                             className: 'label-text'
//                         }]
//                     },
//                     markup: [{
//                         tagName: 'circle',
//                         selector: 'portBody'
//                     }]
//                 }
//                 }
//                 }
//             });
//             for (let pin in port['pins']) {
//                 this.addConnection(pin["name"], port["name"])
//             }
// }
 //       }
}


class AtoModule extends dia.Element {
    defaults() {
      return {
        ...super.defaults,
        type: "AtoModule",
        size: { width: 200, height: 200 },
        collapsed: false,
        attrs: {
          body: {
            fill: "transparent",
            stroke: "#333",
            strokeWidth: settings_dict["module"]["strokeWidth"],
            width: "calc(w)",
            height: "calc(h)"
          },
          label: {
            text: "Module",
            fill: "#333",
            fontSize: settings_dict["module"]["strokeWidth"],
            fontWeight: "bold",
            textVerticalAnchor: "middle",
            textAnchor: "middle",
            fontFamily: "sans-serif",
            x: "calc(w / 2)"
          }
        }
      };
    }
  
    preinitialize(...args) {
      this.markup = util.svg`
              <rect @selector="body" />
              <text @selector="label" />
          `;
    }
  
    updateChildrenVisibility() {
      const collapsed = this.isCollapsed();
      this.getEmbeddedCells().forEach((child) => child.set("hidden", collapsed));
    }

    fitAncestorElements() {
        var padding = 10;
        this.fitParent({
            deep: true,
            padding: {
                top:  padding,
                left: padding,
                right: padding,
                bottom: padding
            }
        });
    }
  }




const cellNamespace = {
    ...shapes,
    AtoElement,
    AtoComponent,
    AtoModule
};

function addPortsAndPins(element, port_list) {
    let port_groups = {};
    for (let port of port_list) {
        port_groups[port['name']] = {
            position: {
                name: port['location'],
            },
            attrs: {
                portBody: {
                    magnet: true,
                    r: 5,
                    fill: '#FFFFFF',
                    stroke:'#023047'
                }
            },
            label: {
                position: {
                    name: port['location'],
                    args: { y: 0 }
                },
                markup: [{
                    tagName: 'text',
                    selector: 'label',
                    className: 'label-text'
                }]
            },
            markup: [{
                tagName: 'circle',
                selector: 'portBody'
            }]
        };
        for (let pin of port['pins']) {
            element.addPort({ 
                group: port['name'],
                attrs: { 
                    label: { 
                        text: pin['name'],
                        fontFamily: "sans-serif",
                    }
                }
            });
        }
    };
    element.prop({"ports": { "groups": port_groups}});

    return port_groups;
}

function createComponent(title, ports_dict, x, y) {
    const component = new AtoComponent({
        attrs: {
            label: {
                text: title
            }
        }
    });
    console.log('part name ' + title);
    addPortsAndPins(component, ports_dict)
    //component.prop({"ports": { "groups": createPorts(ports)}});
    component.addTo(graph);
    component.position(x, y, { parentRelative: true });
    return component;
}

function createModule(title, x, y) {
    const module = new AtoModule({
        attrs: {
            label: {
                text: title
            }
        }
    });
    module.addTo(graph);
    module.position(x, y, { parentRelative: false });
    return module;
}

function addModuleToModule(module_to_add, to_module) {
    to_module.embed(module_to_add);
}

function buildClassesFromDict(list) {
    let list_of_elements = [];
    for (let element of list) {
        if (element['type'] == 'component') {
            let created_comp = createComponent(title = element['name'], element['ports'], x = 20, y = 20);
            list_of_elements.push(created_comp)
        }
        else if (element['type'] == 'module') {
            let created_module = createModule(title = element['name'], 20, 20);
            list_of_elements.push(created_module);
            returned_list = buildClassesFromDict(element['modules']);
            for (let nested_element of returned_list) {
                addModuleToModule(nested_element, created_module);
            }
        }
    }
    return list_of_elements;
    // if (dict['type'] == 'component') {
    //     let component = createComponent(title = dict['name'], x = 10, y = 10);
    //     return component;
    // }
    // else {
    //     let module = createModule(title = dict['name'], x = 10, x = 10);
    // }
    // let module = new Module(dict.info);
    // for (let subModule of dict.modules) {
    //     module.addModule(buildClassesFromDict(subModule));
    // }
    // for (let component of dict.components) {
    //     module.addComponent(buildClassesFromDict(component, true));
    // }
    // return module;
    
}

const graph = new dia.Graph({}, { cellNamespace });
const paper = new joint.dia.Paper({
    el: document.getElementById('atopilePaper'),
    model: graph,
    width: 600,
    height: 600,
    gridSize: 10,
    drawGrid: true,
    background: {
        color: settings_dict["paper"]["backgroundColor"]
    },
    cellViewNamespace: cellNamespace,
    // restrictTranslate: (elementView) => {
    //     const parent = elementView.model.getParentCell();
    //     if (!parent) return null; // No restriction
    //     // Activity movement is constrained by the parent area
    //     const { x, y, width, height } = parent.getBBox();
    //     return new g.Rect(
    //       x,
    //       y,
    //       width,
    //       height
    //     ).inflate(10);
    //   },
});
// module2 = createModule("module2", 100, 100)
// module1 = createModule('this is a module', 10, 10)
// test = createComponent('allo', 10, 10);
// test.addNewPort('port 1', 'right');
// test.addConnection('pin 1', 'port 1');
// test.addConnection('pin 3', 'port 1');
// test.addNewPort('port 2', 'left');
// test.addConnection('pin 2', 'port 2');
// test.addConnection('pin 4', 'port 2');

// comp2 = createComponent('comp2', 10, 10);



// addModuleToModule(module1, module2)


// addModuleToModule(test, module1);
// addModuleToModule(comp2, module1);

// var ports = test.getPorts();
// console.log(ports);
// console.log(typeof ports);
// ports.forEach(element => {
//     console.log(element);
// });

// console.log(test.getGroupPorts('port 1'));
// console.log('new stuff');

// let result = test.prop('ports/groups');
// console.log(result);
// console.log(typeof result);



buildClassesFromDict(list = input_list)


paper.on('cell:pointerup', function(evt, x, y) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph.toJSON()) // << data going the other way
    };
    fetch('/api/graph', requestOptions);
});

paper.on('element:pointermove', function(elementView) {
    var element = elementView.model;
    // `fitAncestorElements()` method is defined at `joint.shapes.container.Base` in `./joint.shapes.container.js`
    element.fitAncestorElements();
});



