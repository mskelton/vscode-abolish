export function expandPattern(
  pattern: string,
  replacement: string,
): Record<string, string> {
  const result: Record<string, string> = {}
  const patternGroups = extractBraceGroups(pattern)
  const replacementGroups = extractBraceGroups(replacement)

  const patternCombinations = generateCombinations(pattern, patternGroups)

  for (const patternCombo of patternCombinations) {
    const replacementCombo = generateReplacement(
      replacement,
      replacementGroups,
      patternGroups,
      patternCombo.selections,
    )
    result[patternCombo.text] = replacementCombo
  }

  return result
}

interface BraceGroup {
  end: number
  options: string[]
  start: number
}

interface Combination {
  selections: string[]
  text: string
}

function extractBraceGroups(text: string): BraceGroup[] {
  const groups: BraceGroup[] = []
  const regex = /\{([^}]*)\}/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const content = match[1]
    groups.push({
      end: match.index + match[0].length - 1,
      options: content ? content.split(',') : [''],
      start: match.index,
    })
  }

  return groups
}

function generateCombinations(
  pattern: string,
  groups: BraceGroup[],
): Combination[] {
  if (groups.length === 0) {
    return [{ selections: [], text: pattern }]
  }

  const combinations: Combination[] = []
  const indices = new Array(groups.length).fill(0)

  while (true) {
    let result = pattern
    const selections: string[] = []
    let offset = 0

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i]
      const selectedOption = group.options[indices[i]]
      selections.push(selectedOption)

      const adjustedStart = group.start - offset
      const adjustedEnd = group.end - offset + 1

      result =
        result.substring(0, adjustedStart) +
        selectedOption +
        result.substring(adjustedEnd)

      offset += group.end - group.start + 1 - selectedOption.length
    }

    combinations.push({ selections, text: result })

    let i = groups.length - 1
    while (i >= 0 && indices[i] === groups[i].options.length - 1) {
      indices[i] = 0
      i--
    }

    if (i < 0) break
    indices[i]++
  }

  return combinations
}

function generateReplacement(
  replacement: string,
  replacementGroups: BraceGroup[],
  patternGroups: BraceGroup[],
  patternSelections: string[],
): string {
  let result = replacement

  for (let i = replacementGroups.length - 1; i >= 0; i--) {
    const group = replacementGroups[i]
    let selectedOption: string

    if (group.options.length === 1 && group.options[0] === '') {
      selectedOption = patternSelections[i] || ''
    } else {
      const patternIndex = patternGroups[i].options.indexOf(
        patternSelections[i],
      )
      selectedOption =
        patternIndex !== -1 ? group.options[patternIndex] : group.options[0]
    }

    result =
      result.substring(0, group.start) +
      selectedOption +
      result.substring(group.end + 1)
  }

  return result
}

export function expandDictionary(
  dictionary: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [pattern, replacement] of Object.entries(dictionary)) {
    if (pattern.includes('{') && pattern.includes('}')) {
      Object.assign(result, expandPattern(pattern, replacement))
    } else {
      result[pattern] = replacement
    }
  }

  return result
}
