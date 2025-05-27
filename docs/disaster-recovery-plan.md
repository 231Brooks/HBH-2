# Disaster Recovery Plan

## Overview

This document outlines the disaster recovery procedures for the HBH Real Estate Platform. It provides step-by-step instructions for recovering from various types of failures and outages.

## Contact Information

**Primary Contact:** [Your Name] - [Your Email] - [Your Phone]
**Secondary Contact:** [Team Member] - [Email] - [Phone]
**DevOps Lead:** [DevOps Name] - [Email] - [Phone]

## Recovery Time Objectives (RTO)

- **Critical Systems:** 1 hour
- **Important Systems:** 4 hours
- **Non-critical Systems:** 24 hours

## Recovery Point Objectives (RPO)

- **Database:** 15 minutes (maximum data loss)
- **File Storage:** 1 hour
- **User Content:** 4 hours

## Backup Systems

### Database Backups

- **Frequency:** Hourly incremental, Daily full
- **Retention:** Hourly backups for 24 hours, Daily backups for 30 days, Monthly backups for 1 year
- **Location:** Primary: Supabase, Secondary: AWS S3
- **Verification:** Automated weekly verification (see scripts/verify-backup.ts)

### File Storage Backups

- **Frequency:** Daily
- **Retention:** 30 days
- **Location:** Cloudinary with AWS S3 backup

### Code and Configuration Backups

- **Frequency:** With each deployment
- **Location:** GitHub, Vercel

## Disaster Scenarios and Recovery Procedures

### 1. Database Failure

#### Detection

- Monitoring alerts from Supabase
- Application error logs showing database connection failures
- Performance dashboard showing database unavailability

#### Recovery Steps

1. **Assess the Situation**
   - Determine if it's a connection issue or data corruption
   - Check Supabase status page

2. **For Connection Issues**
   - Verify network connectivity
   - Check database credentials
   - Restart the application to re-establish connections

3. **For Data Corruption**
   - Identify the extent of corruption
   - Stop write operations to prevent further damage
   - Restore from the most recent backup:

   \`\`\`bash
   # Restore from Supabase backup
   PGPASSWORD=$SUPABASE_POSTGRES_PASSWORD psql -h $SUPABASE_POSTGRES_HOST -U $SUPABASE_POSTGRES_USER -d $SUPABASE_POSTGRES_DATABASE -f backup-file.sql
   \`\`\`

4. **Verify Recovery**
   - Run database integrity checks
   - Verify application functionality
   - Check for data loss

### 2. Application Failure

#### Detection

- Vercel deployment failure alerts
- Application monitoring alerts
- User-reported issues

#### Recovery Steps

1. **Identify the Cause**
   - Check deployment logs
   - Review application error logs
   - Examine recent code changes

2. **For Deployment Failures**
   - Rollback to the last stable version:
   
   \`\`\`bash
   # Using Vercel CLI
   vercel rollback --environment=production
   \`\`\`

3. **For Runtime Errors**
   - Apply hotfix if possible
   - If not, rollback and fix in development

4. **Verify Recovery**
   - Test critical user flows
   - Monitor error rates
   - Check performance metrics

### 3. Complete Service Outage

#### Detection

- Multiple monitoring alerts
- External uptime monitoring service
- User reports

#### Recovery Steps

1. **Assess the Scope**
   - Determine which components are affected
   - Check third-party service status

2. **Activate Incident Response Team**
   - Notify all team members according to on-call schedule
   - Assign roles: Incident Commander, Communications, Technical Lead

3. **Restore Core Services**
   - Follow priority order: Database, API, Frontend
   - Deploy to alternative region if necessary

4. **Communicate Status**
   - Update status page
   - Send notifications to affected users
   - Provide regular updates to stakeholders

5. **Post-Recovery Actions**
   - Conduct root cause analysis
   - Document lessons learned
   - Implement preventive measures

## Testing and Maintenance

### Regular Testing Schedule

- **Database Recovery:** Monthly
- **Application Rollback:** Quarterly
- **Full Disaster Recovery:** Bi-annually

### Documentation Updates

This plan should be reviewed and updated:
- After each recovery test
- When new systems are added
- When architecture changes
- At least quarterly

## Appendix

### Recovery Scripts

See the `/scripts` directory for automated recovery scripts:
- `verify-backup.ts`: Tests backup integrity
- `restore-database.sh`: Automates database restoration
- `rollback-deployment.sh`: Automates application rollback

### Monitoring Dashboard Access

- Performance Dashboard: https://yourdomain.com/admin/performance
- Logs Dashboard: https://yourdomain.com/admin/logs
- Infrastructure Dashboard: https://vercel.com/your-team/your-project/analytics
