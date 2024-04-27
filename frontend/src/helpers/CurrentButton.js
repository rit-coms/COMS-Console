
export const CurrentButton = (controller) => {

    const BUTTONS = {
        0: 'B',
        1: 'A',
        2: 'Y',
        3: 'X',
        4: 'LEFT TRIGGER',
        5: 'RIGHT TRIGGER',
        6: 'LEFT TRIGGER',
        7: 'RIGHT TRIGGER',
        8: 'SELECT',
        9: 'START',
        10: null,
        11: null,
        12: 'UP',
        13: 'DOWN',
        14: 'LEFT',
        15: 'RIGHT',
    }

    if (!controller)
        return

    let _button = null
    controller.buttons.forEach((button) => {
        if (button.pressed) {
            _button = (BUTTONS[controller.buttons.indexOf(button)])
        }
    })

    return _button

}