# TextReply

> Превью цитируемого сообщения в чате — показывает имя автора и сокращённый текст с вертикальной полоской слева.

## When to use / when not to use
- ✅ Use inside a message bubble to show the message being replied to
- ✅ Use in the composer area to display the active reply context
- ❌ Don't use for forward previews — use a separate ForwardPreview variant
- ❌ Don't show more than one TextReply per message

## Anatomy
Container → Inner → [InfoTitle] + [Text] + [Line]

- **Container** — `div.text-reply`, `334×66px`, `border-radius: 16px 16px 0 0`, `border-bottom: 0.5px solid yellow`, `padding: 4px 12px`
- **Inner** — `div.text-reply__inner`, `padding-left: 10px`, `position: relative` — якорь для полоски
- **InfoTitle** — атом `div.info-title` (reply-вариант): иконка reply + имя отправителя
- **Text** — `p.text-reply__text`, Body/Medium, `transparent-60`, одна строка с ellipsis
- **Line** — `div.text-reply__line`, абсолютная, `left:0 top:3px bottom:4px width:2px`, `transparent-87`

## Variants
| Variant | Description |
|---|---|
| Default | InfoTitle (reply) + текст + полоска |

⚠️ Variant missing: **Forward**. Figma может иметь вариант с forward-иконкой. Если нужен — уточни.

## States
| State | Description |
|---|---|
| Default | Статичный превью, без интерактивности |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-secondary` | Нижняя граница контейнера |
| `--color-primary-transparent-87` | Левая полоска |
| `--color-primary-transparent-60` | Текст цитаты |
| `--text-body-medium-*` | Текст цитаты (14px / 400 / lh 18px) |

## Do / Don't
✅ **Do** — используй атом `info-title` для строки с именем — не дублируй его стили  
❌ **Don't** — не меняй `height: 66px` — компонент рассчитан под фиксированную высоту  
✅ **Do** — truncate текст через `text-overflow: ellipsis` — полный текст в самом сообщении  

## Accessibility
- Контейнер не интерактивен — touch target не требуется
- Добавь `aria-label="Reply to Abram"` на родительский элемент для контекста

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui
