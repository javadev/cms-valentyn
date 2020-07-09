package org.jhipster.health.web.rest;

import org.jhipster.health.TwentyOnePointsApp;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PreferencesResource} REST controller.
 */
@SpringBootTest(classes = TwentyOnePointsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class PreferencesResourceIT {

    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    @Autowired
    private PreferencesRepository preferencesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPreferencesMockMvc;

    private Preferences preferences;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createEntity(EntityManager em) {
        Preferences preferences = new Preferences()
            .weeklyGoal(DEFAULT_WEEKLY_GOAL);
        return preferences;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createUpdatedEntity(EntityManager em) {
        Preferences preferences = new Preferences()
            .weeklyGoal(UPDATED_WEEKLY_GOAL);
        return preferences;
    }

    @BeforeEach
    public void initTest() {
        preferences = createEntity(em);
    }

    @Test
    @Transactional
    public void createPreferences() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();
        // Create the Preferences
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isCreated());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate + 1);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
    }

    @Test
    @Transactional
    public void createPreferencesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences with an existing ID
        preferences.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkWeeklyGoalIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeeklyGoal(null);

        // Create the Preferences, which fails.


        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get all the preferencesList
        restPreferencesMockMvc.perform(get("/api/preferences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)));
    }
    
    @Test
    @Transactional
    public void getPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(preferences.getId().intValue()))
            .andExpect(jsonPath("$.weeklyGoal").value(DEFAULT_WEEKLY_GOAL));
    }
    @Test
    @Transactional
    public void getNonExistingPreferences() throws Exception {
        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Update the preferences
        Preferences updatedPreferences = preferencesRepository.findById(preferences.getId()).get();
        // Disconnect from session so that the updates on updatedPreferences are not directly saved in db
        em.detach(updatedPreferences);
        updatedPreferences
            .weeklyGoal(UPDATED_WEEKLY_GOAL);

        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPreferences)))
            .andExpect(status().isOk());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
    }

    @Test
    @Transactional
    public void updateNonExistingPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeDelete = preferencesRepository.findAll().size();

        // Delete the preferences
        restPreferencesMockMvc.perform(delete("/api/preferences/{id}", preferences.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
