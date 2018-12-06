import { createDomElement, updateDomProperties } from "./dom-utils";
import { createInstance, MCComponent, MCDOMChildren } from "./element";
import useLayoutEffect from "./useLayoutEffect";
import useRef from "./useRef";
import useState, { StateUpdate } from "./useState";

const ENOUGH_TIME = 1;

export type FiberTag = "func" | "host" | "root";

export type FiberEffect = "place" | "delete" | "update";

export default function createRenderer() {
  const updateQueue: any[] = [];
  let nextUnitOfWork: any = null;
  let pendingCommit: any = null;

  function performWork(deadline: RequestIdleCallbackDeadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 0) {
      window.requestIdleCallback(performWork);
    }
  }

  function workLoop(deadline: RequestIdleCallbackDeadline) {
    if (!nextUnitOfWork) {
      resetNextUnitOfWork();
    }
    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (pendingCommit) {
      commitAllWork(pendingCommit);
    }
  }

  function resetNextUnitOfWork() {
    const update = updateQueue.shift();
    if (!update) {
      return;
    }

    if (update.stateUpdate) {
      update.instance.__fiber.stateUpdate = update.stateUpdate;
    }

    const root =
      update.from === "root"
        ? update.dom._rootContainerFiber
        : getRoot(update.instance.__fiber);

    nextUnitOfWork = {
      tag: "root",
      stateNode: update.dom || root.stateNode,
      props: update.newProps || root.props,
      alternate: root
    };
  }

  function getRoot(fiber: any) {
    let node = fiber;
    while (node.parent) {
      node = node.parent;
    }
    return node;
  }

  function performUnitOfWork(wipFiber: any) {
    beginWork(wipFiber);
    if (wipFiber.child) {
      return wipFiber.child;
    }

    // No child, we call completeWork until we find a sibling
    let uow = wipFiber;
    while (uow) {
      completeWork(uow);
      if (uow.sibling) {
        // Sibling needs to beginWork
        return uow.sibling;
      }
      uow = uow.parent;
    }
  }

  function beginWork(wipFiber: any) {
    if (wipFiber.tag === "func") {
      updateFuncComponent(wipFiber);
    } else {
      updateHostComponent(wipFiber);
    }
  }

  function updateFuncComponent(wipFiber: any) {
    let instance = wipFiber.stateNode;
    if (!instance) {
      // Call class constructor
      instance = wipFiber.stateNode = createInstance(wipFiber);
    } else if (wipFiber.props === instance.props && !wipFiber.stateUpdate) {
      // No need to render, clone children from last time
      cloneChildFibers(wipFiber);
      return;
    }

    instance.props = wipFiber.props;
    if (wipFiber.stateUpdate) {
      instance.states[wipFiber.stateUpdate.index] = wipFiber.stateUpdate.value;
      wipFiber.stateUpdate = null;
    }

    const newChildElements = instance.render(instance.props, {
      useLayoutEffect: useLayoutEffect(instance),
      useRef: useRef(instance),
      useState: useState(instance, scheduleUpdate),
    });
    reconcileChildrenArray(wipFiber, newChildElements);
  }

  function updateHostComponent(wipFiber: any) {
    if (!wipFiber.stateNode) {
      wipFiber.stateNode = createDomElement(wipFiber);
    }

    const newChildElements = wipFiber.props.children;
    reconcileChildrenArray(wipFiber, newChildElements);
  }

  function arrify(val: any) {
    return !val ? [] : Array.isArray(val) ? val : [val];
  }

  function reconcileChildrenArray(wipFiber: any, newChildElements: any) {
    const elements = arrify(newChildElements);

    let index = 0;
    let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
    let newFiber = null;

    while (index < elements.length || !!oldFiber) {
      const prevFiber: any = newFiber;
      const element = index < elements.length && elements[index];
      const sameType = oldFiber && element && element.type === oldFiber.type;

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          tag: oldFiber.tag,
          stateNode: oldFiber.stateNode,
          props: element.props,
          parent: wipFiber,
          alternate: oldFiber,
          stateUpdate: oldFiber.stateUpdate,
          effectTag: "update"
        };
      }

      if (element && !sameType) {
        newFiber = {
          type: element.type,
          tag: typeof element.type === "string" ? "host" : "func",
          props: element.props,
          parent: wipFiber,
          effectTag: "place"
        };
      }

      if (oldFiber && !sameType) {
        oldFiber.effectTag = "delete";
        wipFiber.effects = wipFiber.effects || [];
        wipFiber.effects.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (prevFiber && element) {
        prevFiber.sibling = newFiber;
      }

      index++;
    }
  }

  function cloneChildFibers(parentFiber: any) {
    const oldFiber = parentFiber.alternate;

    if (!oldFiber.child) {
      return;
    }

    let oldChild: any = oldFiber.child;
    let prevChild: any = null;

    while (oldChild) {
      const newChild = {
        type: oldChild.type,
        tag: oldChild.tag,
        stateNode: oldChild.stateNode,
        props: oldChild.props,
        stateUpdate: oldChild.stateUpdate,
        alternate: oldChild,
        parent: parentFiber
      };

      if (prevChild) {
        prevChild.sibling = newChild;
      } else {
        parentFiber.child = newChild;
      }

      prevChild = newChild;
      oldChild = oldChild.sibling;
    }
  }

  function commitAllWork(fiber: any) {
    fiber.effects.forEach((f: any) => {
      commitWork(f);
    });
    fiber.stateNode._rootContainerFiber = fiber;
    nextUnitOfWork = null;
    pendingCommit = null;
  }

  function commitWork(fiber: any) {
    if (fiber.tag === "root") {
      return;
    }

    let domParentFiber = fiber.parent;
    while (domParentFiber.tag === "func") {
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.stateNode;

    if (fiber.effectTag === "place" && fiber.tag === "host") {
      domParent.appendChild(fiber.stateNode);
    } else if (fiber.effectTag === "update") {
      updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "delete") {
      commitDeletion(fiber, domParent);
    }

    if (fiber.stateNode.layoutEffects && fiber.stateNode.layoutEffects.length > 0) {
      fiber.stateNode.layoutEffects.forEach((effect: any) => effect());
    }
  }

  function commitDeletion(fiber: any, domParent: Element) {
    let node = fiber;
    while (true) {
      if (node.tag === "func") {
        node = node.child;
        continue;
      }
      domParent.removeChild(node.stateNode);
      while (node !== fiber && !node.sibling) {
        node = node.parent;
      }
      if (node === fiber) {
        return;
      }
      node = node.sibling;
    }
  }

  function completeWork(fiber: any) {
    if (fiber.tag === "func") {
      fiber.stateNode.__fiber = fiber;
    }

    if (fiber.parent) {
      const childEffects = fiber.effects || [];
      const thisEffect = fiber.effectTag != null ? [fiber] : [];
      const parentEffects = fiber.parent.effects || [];
      fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
    } else {
      pendingCommit = fiber;
    }
  }

  function scheduleUpdate(instance: MCComponent, stateUpdate: StateUpdate) {
    updateQueue.push({
      from: "func",
      instance: instance,
      stateUpdate
    });
    window.requestIdleCallback(performWork);
  }

  return {
    render(elements: MCDOMChildren, containerDom: Element) {
      updateQueue.push({
        from: "root",
        dom: containerDom,
        newProps: { children: elements }
      });
      window.requestIdleCallback(performWork);
    }
  };
}
