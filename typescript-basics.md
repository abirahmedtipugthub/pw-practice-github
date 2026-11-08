# F-05: TypeScript Basics

## Variables — Your Gear Inventory

### `let` — Gear You Can Swap Mid-Mission
You start a mission with a pistol, pick up a rifle later — the slot changes.

```typescript
let weapon: string = 'Pistol';
weapon = 'AK-47'; // ✅ swapped mid-mission
```

### `const` — Your Mission Objective (Locked In)
Once assigned, it never changes. Like your mission briefing — you can't rewrite it halfway through.

```typescript
const mission: string = 'Rescue the hostage';
// mission = 'Steal the intel'; // ❌ ERROR — can't change a const
```

## Types — Labeling Your Intel Slots

| Type | What It Holds | CoD Example |
|------|--------------|-------------|
| `string` | Text | `'Tipu'` — your callsign |
| `number` | Numbers | `25` — your kill count |
| `boolean` | Yes or No | `true` — are you alive? |
| `string[]` | List of text | `['AK-47', 'M4A1', 'Sniper']` — weapon wheel |

```typescript
let playerName: string = 'Tipu';
let kills: number = 25;
let isAlive: boolean = true;
let weapons: string[] = ['AK-47', 'M4A1', 'Sniper'];
```

## Quick Rules

- `let` = can change → use for things that update (score, health, ammo)
- `const` = locked → use for things that stay fixed (team name, mission ID)
- Always add the type after `:` → TypeScript catches wrong ammo in the wrong slot before the mission starts