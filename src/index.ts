import {
  FromKeyParam,
  layer,
  map,
  rule,
  toKey,
  ToKeyParam,
  toSetVar,
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
        ["p", "delete_or_backspace"],
        [";", "return_or_enter"],
        ["b", "japanese_kana"],
        ["g", "japanese_eisuu"],
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
        ["x", 1],
        ["c", 2],
        ["v", 3],
        ["s", 4],
        ["d", 5],
        ["f", 6],
        ["w", 7],
        ["e", 8],
        ["r", 9],
        ["z", 0],
      ] as const
    ).flatMap(([fromKey, toKey]) => {
      return [
        map(fromKey).to(toKey),
        ...generateModifierMapping(fromKey, toKey, modKeys),
      ];
    }),

    map("tab").to("tab", "option"),
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
