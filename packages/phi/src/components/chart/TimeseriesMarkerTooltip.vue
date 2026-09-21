<script setup lang="ts">
import { defaultTooltipTimestampFormat, type MarkerTooltipState } from "./timeseries-tooltip";

const props = defineProps<{
  state: MarkerTooltipState;
  valueFormat?: (value: number) => string;
  timestampFormat?: (timestamp: number) => string;
  footer?: string;
}>();

const defaultNumberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

function formatTimestamp(value: number) {
  return props.timestampFormat?.(value) ?? defaultTooltipTimestampFormat.format(value);
}

function formatDefaultValue(value: number) {
  return Number.isInteger(value) ? String(value) : defaultNumberFormat.format(value);
}
</script>

<template>
  <div
    class="phi-chart-marker-tooltip"
    :data-align="state.align"
    :style="{ left: `${state.left}px`, top: `${state.top}px` }"
    role="tooltip"
  >
    <div v-if="state.markers.length === 1" class="phi-chart-marker-tooltip__title">
      {{ formatTimestamp(state.markers[0].timestamp) }}
    </div>
    <div class="phi-chart-marker-tooltip__markers">
      <div v-for="(marker, index) in state.markers" :key="`${marker.timestamp}-${marker.label ?? ''}-${index}`">
        <div class="phi-chart-marker-tooltip__marker-row">
          <span class="phi-chart-marker-tooltip__dot" :style="{ backgroundColor: marker.color ?? state.color }" />
          <span class="phi-chart-marker-tooltip__marker-label">{{ marker.label ?? "Reference marker" }}</span>
          <span v-if="state.markers.length > 1" class="phi-chart-marker-tooltip__timestamp">
            {{ formatTimestamp(marker.timestamp) }}
          </span>
        </div>
        <div v-if="marker.description" class="phi-chart-marker-tooltip__description">
          {{ marker.description }}
        </div>
      </div>
    </div>
    <div v-if="state.rows.length > 0" class="phi-chart-marker-tooltip__series">
      <div v-for="row in state.rows" :key="row.name" class="phi-chart-marker-tooltip__series-row">
        <span class="phi-chart-marker-tooltip__series-name">
          <span class="phi-chart-marker-tooltip__dot" :style="{ backgroundColor: row.color }" />
          <span>{{ row.name }}</span>
        </span>
        <strong>{{ valueFormat ? valueFormat(row.value) : formatDefaultValue(row.value) }}</strong>
      </div>
      <div v-if="state.hiddenCount > 0" class="phi-chart-marker-tooltip__more">
        +{{ state.hiddenCount }} more
      </div>
    </div>
    <div v-if="footer" class="phi-chart-marker-tooltip__footer">
      {{ footer }}
    </div>
  </div>
</template>
