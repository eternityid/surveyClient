export class HtmlUtil {
    public static replaceClass(element: HTMLElement, oldClass: string, newClass: string) {
        if (oldClass)
            element.classList.remove(oldClass);
        if (newClass)
            element.classList.add(newClass);
    }

    public static createHtmlElWithContent(tagName: string, content: string) {
        let result = document.createElement(tagName);
        result.innerHTML = content;
        return result;
    }

    public static getElStyleNumberValue(value: string | null, unit: string = 'px') {
        if (value == null) return null;
        let intValueAsString = value.replace(unit, '');
        try {
            return parseFloat(intValueAsString);
        } catch (e) {
            return null;
        }
    }

    public static getClosest(el: any, tag: any): HTMLElement | null {
        tag = tag.toUpperCase();
        do {
            if (el.nodeName === tag) {
                return el;
            }
        } while (el = el.parentNode);

        return null;
    }

    public static contains(parent: HTMLElement, child: Node | Element | HTMLElement) {
        if (child == null) return false;
        if (parent === child) return true;
        let childNodeParent = child.parentElement;
        while (childNodeParent != null) {
            if (childNodeParent === parent) return true;
            childNodeParent = childNodeParent.parentElement;
        }
        return false;
    }

    public static buildNewMouseEventData(clickEvent: any) {
        let el = document.elementFromPoint(clickEvent.clientX, clickEvent.clientY);
        if (el == null) return null;
        return {
            bubbles: true,
            cancelable: true,
            view: window,
            sourceCapabilities: clickEvent.originalEvent ? clickEvent.originalEvent.sourceCapabilities : null,
            which: clickEvent.which,
            screenX: clickEvent.screenX,
            screenY: clickEvent.screenY,
            pageX: clickEvent.pageX,
            pageY: clickEvent.pageY,
            clientX: clickEvent.clientX,
            clientY: clickEvent.clientY,
            x: clickEvent.clientX,
            y: clickEvent.clientY,
            button: clickEvent.button,
            buttons: clickEvent.buttons,
            target: el,
            toElement: el,
            currentTarget: el
        };
    }

    public static getTextFromHtmlString(htmlString: string) {
        let element = document.createElement("div");
        element.innerHTML = htmlString;
        return this.getText(element as Node);
    }

    public static getText(element: Node | HTMLElement): string {
        let node,
            ret = "",
            i = 0,
            nodeType = element.nodeType;

        if (nodeType === DomNodeType.elementNode || nodeType === DomNodeType.documentNode || nodeType === DomNodeType.documentFragmentNode) {
            if (typeof element.textContent === "string") {
                return element.textContent;
            } else {
                let elementChild: Node | null;
                for (elementChild = element.firstChild; elementChild != null; elementChild = elementChild.nextSibling) {
                    ret += this.getText(elementChild);
                }
            }
        } else if (nodeType === DomNodeType.textNode) {
            return element.nodeValue != null ? element.nodeValue as string : "";
        }

        return ret;
    };

    public static findTextNodes(rootElement: HTMLElement) {
        return this.findNodes(rootElement,
            (node: Node) => { return node.nodeType === DomNodeType.textNode; },
            (node: Node) => { return node.nodeType in [DomNodeType.elementNode, DomNodeType.documentNode, DomNodeType.documentFragmentNode]; });
    }

    public static findFirstNode(rootElement: HTMLElement, nodeFilter: (node: Node | HTMLElement) => boolean, isFindRecursively?: (node: Node) => boolean): Node | HTMLElement | null {
        if (rootElement == null) return null;
        for (let i = 0; i < rootElement.childNodes.length; i++) {
            let node = rootElement.childNodes[i];
            if (nodeFilter(node)) {
                return node;
            } else if (node.childNodes.length > 0 && (isFindRecursively == null || isFindRecursively(node))) {
                let recursiveResult = this.findFirstNode(<HTMLElement>node, nodeFilter, isFindRecursively);
                if (recursiveResult != null) return recursiveResult;
            }
        }
        return null;
    }

    public static findNodes(rootElement: HTMLElement, nodeFilter: (node: Node) => boolean, isFindRecursively?: (node: Node) => boolean) {
        if (rootElement == null) return [];
        let result: Node[] = [];
        buildResult(rootElement);
        return result;

        function buildResult(element: HTMLElement) {
            for (let i = 0; i < element.childNodes.length; i++) {
                let node = element.childNodes[i];
                if (nodeFilter(node)) {
                    result.push(node);
                } else if (node.childNodes.length > 0 && (isFindRecursively == null || isFindRecursively(node))) {
                    buildResult(<HTMLElement>node);
                }
            }
        }
    }

    public static findElements(rootElement: HTMLElement, elementFilter: (element: HTMLElement) => boolean, isFindRecursively?: (element: HTMLElement) => boolean) {
        if (rootElement == null) return [];
        let result: HTMLElement[] = [];
        buildResult(rootElement);
        return result;

        function buildResult(element: HTMLElement) {
            for (let i = 0; i < element.children.length; i++) {
                let childElement = <HTMLElement>element.children[i];
                if (childElement == null) continue;
                if (elementFilter(childElement)) {
                    result.push(childElement);
                } else if (childElement.children.length > 0 && (isFindRecursively == null || isFindRecursively(element))) {
                    buildResult(childElement);
                }
            }
        }
    }

    public static getChildTextNode(elementNode: Node, atLast: boolean = false): Node | null {
        if (elementNode == null) return null;
        if (elementNode.childNodes != null && elementNode.childNodes.length > 0) {
            var selectedChildNode = elementNode.childNodes[atLast ? elementNode.childNodes.length - 1 : 0];
            if (selectedChildNode.nodeType === DomNodeType.textNode) return selectedChildNode;
            if (selectedChildNode.childNodes != null && selectedChildNode.childNodes.length > 0) {
                return this.getChildTextNode(selectedChildNode.childNodes[atLast ? selectedChildNode.childNodes.length - 1 : 0], atLast);
            }
        }
        return elementNode;
    }

    public static indexInParent(element: HTMLElement | null) {
        if (element == null || element.parentElement == null) return -1;

        for (var i = 0; i < element.parentElement.children.length; i++) {
            if (element.parentElement.children[i] === element) return i;
        }

        return -1;
    }

    public static getParentElementWithClassName(element: HTMLElement, className: string) {
        if (element == null || element.parentElement == null) return null;

        let parentElement: HTMLElement | null = element.parentElement;
        while (parentElement != null) {
            if (parentElement.classList.contains(className)) {
                return parentElement;
            }
            parentElement = parentElement.parentElement;
        }

        return parentElement;

    }
    public static getComputedStyle(el: HTMLElement, styleName: string) {
        try {
            return window.getComputedStyle(el, undefined).getPropertyValue(styleName);
        } catch (e) {
            return el.style[styleName];
        }
    }

    public static getFirstChildElementInParentViewPort(parentEl: HTMLElement, childEls?: HTMLElement[], startCheckIndex: number = 0, isDirectChild: boolean = true) {
        let childElements: any = childEls != null ? childEls : parentEl.children;
        for (let i = startCheckIndex; i < childElements.length; i++) {
            if (this.isChildInParentViewPort(parentEl, childElements[i], isDirectChild)) {
                return childElements[i];
            }
        }
    }

    public static isBottomPartOfChildInParentViewPort(parentEl: HTMLElement, childEl: HTMLElement, isDirectChild: boolean = true) {
        if (childEl.clientHeight == 0) return false;

        if (isDirectChild) {
            return (childEl.offsetTop < parentEl.scrollTop && childEl.offsetTop + childEl.clientHeight > parentEl.scrollTop);
        } else {
            let childElTop = childEl.getBoundingClientRect().top;
            let childElHeight = childEl.getBoundingClientRect().height;
            let parentElTop = parentEl.getBoundingClientRect().top;

            return (childElTop < parentElTop && childElTop + childElHeight > parentElTop);
        }
    }

    public static isChildInParentViewPort(parentEl: HTMLElement, childEl: HTMLElement, isDirectChild: boolean = true) {
        if (childEl.clientHeight == 0) return false;

        if (isDirectChild) {
            return (childEl.offsetTop <= parentEl.scrollTop && childEl.offsetTop + childEl.clientHeight > parentEl.scrollTop) ||
                (childEl.offsetTop >= parentEl.scrollTop && childEl.offsetTop < parentEl.scrollTop + parentEl.clientHeight);
        } else {
            let childElTop = childEl.getBoundingClientRect().top;
            let childElHeight = childEl.getBoundingClientRect().height;
            let parentElTop = parentEl.getBoundingClientRect().top;
            let parentElHeight = parentEl.getBoundingClientRect().height;

            return (childElTop <= parentElTop && childElTop + childElHeight > parentElTop) ||
                (childElTop >= parentElTop && childElTop < parentElTop + parentElHeight);
        }
    }

    public static insertAfter(newNode: Node, referenceNode: Node) {
        if (referenceNode.parentNode == null) return;
        if (referenceNode.nextSibling != null) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        } else {
            referenceNode.parentNode.appendChild(newNode);
        }
    }

    public static getElementById(id: string) {
        return document.getElementById(id);
    }

    public static elementFromPoint(x: number, y: number): Element {
        return document.elementFromPoint(x, y);
    }
}

export const DomNodeType = {
    elementNode: 1,
    textNode: 3,
    commentNode: 8,
    documentNode: 9,
    documentTypeNode: 10,
    documentFragmentNode: 11
};