import { visit } from "unist-util-visit"


export default function numberElements(options){
    const tagNames = options.tagNames || []
    const numberPunctuation = options.numberPunctuation || " "
    const prefixNumbers = options.prefixNumbers || false
    const counters = new Array(tagNames.length).fill(1)
    return (tree, file)=>{
        visit(tree,'element', function (node) {
                for(let i = 0; i < tagNames.length; i++){
                    if(node.tagName == tagNames[i]){
                        if(!node.properties.className) node.properties.className = []
                        node.properties.className.push(["numbered", tagNames[i], counters[i]].join('-'))
                        if(prefixNumbers){
                            const firstChild = node.children[0]
                            if(firstChild.type == 'text'){
                                firstChild.value = counters[i] + numberPunctuation + firstChild.value
                            }
                        }

                        counters[i]++
                        console.log(node)
                    }
                }

                
            })
    }
}