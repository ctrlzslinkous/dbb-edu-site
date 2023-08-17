import { visit } from "unist-util-visit"
import hast from 'hast'
import {Root} from 'hast'
import {Element} from 'hast'


export default function numberElements(options: { tagNames: never[]; numberPunctuation: string; prefixNumbers: boolean }){
    const tagNames = options.tagNames || []
    const numberPunctuation = options.numberPunctuation || " "
    const prefixNumbers = options.prefixNumbers || false
    const counters = new Array(tagNames.length).fill(1)
    return (tree:Root)=>{
        visit(tree,'element', function (node: Element) {
                for(let i = 0; i < tagNames.length; i++){
                    if(node.tagName == tagNames[i]){
                        if(!node.properties) continue
                        if(!node.properties.className) node.properties.className = [] as string[]
                        if(Array.isArray(node.properties.className)){
                            node.properties.className.push(["numbered", tagNames[i], counters[i]].join('-'))
                        }
                        if(prefixNumbers){
                            const firstChild = node.children[0]
                            if(firstChild.type == 'text'){
                                firstChild.value = counters[i] + numberPunctuation + firstChild.value
                            }
                        }

                        counters[i]++

                    }
                }

                
            })
    }
}