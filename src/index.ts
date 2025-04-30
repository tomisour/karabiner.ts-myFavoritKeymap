import {
  FromKeyParam,
  layer,
  map,
  rule,
  toKey,
  ToKeyParam,
  writeToProfile,
} from "karabiner.ts";
const modKeys = ["shift", "control", "option", "command", "fn"] as const;
type ModKey = (typeof modKeys)[number];
const generateModifierMapping = (
  fromKeyParam: FromKeyParam,
  toKeyParam: ToKeyParam,
  modifiers: readonly ModKey[],
  currentModifiers: ModKey[] = []
) => {
  if (currentModifiers.length === modifiers.length) {
    return [];
  }
  return modifiers
    .filter((m) => !currentModifiers.includes(m))
    .flatMap((m) => {
      const newModifiers = [...currentModifiers, m];
      return [
        map(fromKeyParam, newModifiers).to(toKey(toKeyParam, newModifiers)),
        ...generateModifierMapping(
          fromKeyParam,
          toKeyParam,
          modifiers,
          newModifiers
        ),
      ];
    });
};
// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile("Default profile", [
  // It is not required, but recommended to put symbol alias to layers,
  // (If you type fast, use simlayer instead, see https://evan-liu.github.io/karabiner.ts/rules/simlayer)
  // to make it easier to write '←' instead of 'left_arrow'.
  // Supported alias: https://github.com/evan-liu/karabiner.ts/blob/main/src/utils/key-alias.ts
  layer("spacebar", "space layer").manipulators([
    //  ijklで移動
    ...(
      [
        ["j", "left_arrow"],
        ["k", "down_arrow"],
        ["l", "right_arrow"],
        ["i", "up_arrow"],
        ["u", "page_up"],
        ["o", "page_down"],
        ["h", "home"],
        ["n", "end"],
        ["g", "return_or_enter"],
        ["t", "delete_or_backspace"],
        ["1", "f1"],
        ["2", "f2"],
        ["3", "f3"],
        ["4", "f4"],
        ["5", "f5"],
        ["6", "f6"],
        ["7", "f7"],
        ["8", "f8"],
        ["9", "f9"],
        ["0", "f10"],
        ["-", "f11"],
        ["=", "f12"],
      ] as const
    ).flatMap(([fromKey, toKey]) => {
      return [
        map(fromKey).to(toKey),
        ...generateModifierMapping(fromKey, toKey, modKeys),
      ];
    }),

    map("x").to(1),
    map("c").to(2),
    map("v").to(3),
    map("s").to(4),
    map("d").to(5),
    map("f").to(6),
    map("w").to(7),
    map("e").to(8),
    map("r").to(9),
    map("z").to(0),

    map("return_or_enter").to("return_or_enter", "command"),
    map("tab").to("tab", "option"),

    map("b").to("spacebar", "control"),
  ]),

  // caps_lockをバッククォートにへんかん
  rule("capslock to backquate").manipulators([
    map("caps_lock").to("`"),
    map("caps_lock", "shift").to("grave_accent_and_tilde", "shift"),
  ]),

  layer("escape", "mouse cursor lau=yer").manipulators([
    // ijklでマウスカーソル移動
    map("i").toMouseKey({
      y: -10,
      speed_multiplier: 100,
    }),
    map("j").toMouseKey({
      x: -10,
      speed_multiplier: 100,
    }),
    map("k").toMouseKey({
      y: 10,
      speed_multiplier: 100,
    }),
    map("l").toMouseKey({
      x: 10,
      speed_multiplier: 100,
    }),
    map("u").toPointingButton("button1"),
    map("o").toPointingButton("button2"),
  ]),
]);
